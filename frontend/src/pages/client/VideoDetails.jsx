// src/pages/videos/VideoDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Heart, Eye, AlertTriangle } from "lucide-react";

const RAW_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Backend endpoints (make sure these match your server)
const endpoints = {
  getOne: (id) => `${API_BASE}/api/video/${id}`,
  addView: (id) => `${API_BASE}/api/video/${id}/view`,
  toggleLike: (id) => `${API_BASE}/api/video/${id}/like`,
};

/* ---------------- URL helpers ---------------- */
function parseYouTubeId(url) {
  if (!url) return null;
  const raw = (url || "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const isYT =
      host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com";
    if (!isYT) return null;

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v) return v;

    // youtube.com/shorts/<id>, /embed/<id>, /live/<id>
    const m = u.pathname.match(/\/(shorts|embed|live)\/([^/?#]+)/i);
    if (m && m[2]) return m[2];

    return null;
  } catch {
    return null;
  }
}
function toYouTubeEmbed(url) {
  const id = parseYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
function normalizeDriveDirect(url) {
  try {
    const raw = (url || "").trim();
    if (!raw) return "";
    const u = new URL(raw);
    if (!u.hostname.includes("drive.google.com")) return raw;
    const m = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (m && m[1]) {
      return `https://drive.google.com/uc?export=download&id=${m[1]}`;
    }
    return raw;
  } catch {
    return (url || "").trim();
  }
}
/* ---------------------------------------------- */

export default function VideoDetails() {
  const { videoId } = useParams();
  const [data, setData] = useState(null);
  const [likeBusy, setLikeBusy] = useState(false);

  // prevent double view bump per session
  const viewKey = useMemo(() => `viewed:${(videoId || "").trim()}`, [videoId]);
  const likeKey = useMemo(() => `liked:${(videoId || "").trim()}`, [videoId]);

  // Load video (single endpoint -> fallback list+find)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get(endpoints.getOne((videoId || "").trim()));
        if (!mounted) return;
        setData(res.data || null);
      } catch {
        try {
          const all = await axios.get(`${API_BASE}/api/video`);
          const id = (videoId || "").trim();
          const found = (all.data || []).find(
            (v) => String(v.videoId).trim() === id
          );
          setData(found || null);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load video");
          setData(null);
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [videoId]);

  // Decide how to play
  const rawUrl = (data?.videoUrl || "").trim();
  const ytEmbed = useMemo(() => toYouTubeEmbed(rawUrl), [rawUrl]);
  const fileSrc = useMemo(() => {
    if (ytEmbed) return null;
    if (!rawUrl) return null;
    return normalizeDriveDirect(rawUrl);
  }, [ytEmbed, rawUrl]);

  // ⬆️ Automatically bump view count once per session
  useEffect(() => {
    if (!data) return;
    if (sessionStorage.getItem(viewKey)) return;

    sessionStorage.setItem(viewKey, "1"); // mark first
    // optimistic UI
    setData((d) => (d ? { ...d, viewCount: (d.viewCount || 0) + 1 } : d));

    axios
      .post(endpoints.addView(videoId))
      .then((res) => {
        // sync with server (optional; if server returns counts)
        const { viewCount, likeCount } = res.data || {};
        setData((d) =>
          d
            ? {
                ...d,
                viewCount:
                  typeof viewCount === "number" ? viewCount : d.viewCount,
                likeCount:
                  typeof likeCount === "number" ? likeCount : d.likeCount,
              }
            : d
        );
      })
      .catch(() => {
        // if it fails, just keep the optimistic count and remove the session flag
        sessionStorage.removeItem(viewKey);
        console.warn("view bump failed");
      });
  }, [data, videoId, viewKey]);

  // ❤️ Like (server-first with optimistic UI)
  async function handleLike() {
    if (!data || likeBusy) return;
    const alreadyLocal = localStorage.getItem(likeKey) === "1";

    setLikeBusy(true);
    // optimistic
    setData((d) =>
      d ? { ...d, likeCount: (d.likeCount || 0) + (alreadyLocal ? -1 : 1) } : d
    );

    try {
      const res = await axios.post(endpoints.toggleLike(videoId), {
        // if your server needs delta when unauthenticated:
        delta: alreadyLocal ? -1 : 1,
      });
      // store local like toggle (for guests)
      if (alreadyLocal) localStorage.removeItem(likeKey);
      else localStorage.setItem(likeKey, "1");

      // sync with server value if returned
      const { likeCount } = res.data || {};
      if (typeof likeCount === "number") {
        setData((d) => (d ? { ...d, likeCount } : d));
      }
    } catch (e) {
      // revert on error
      setData((d) =>
        d ? { ...d, likeCount: (d.likeCount || 0) + (alreadyLocal ? 1 : -1) } : d
      );
      const msg =
        e?.response?.data?.message || e?.message || "Failed to update like";
      toast.error(msg);
    } finally {
      setLikeBusy(false);
    }
  }

  const hasPlayable = Boolean(ytEmbed || fileSrc);

  return (
    
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/videos"
          className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
        >
          <ArrowLeft size={14} /> Back to videos
        </Link>
        <div className="text-xs text-neutral-500">ID: {videoId}</div>
      </div>

      {!data ? (
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
            {ytEmbed ? (
              <iframe
                className="h-[56vw] max-h-[60vh] w-full"
                src={ytEmbed}
                title={data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : fileSrc ? (
              <video
                className="h-[56vw] max-h-[60vh] w-full"
                controls
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
              >
                <source src={fileSrc} type="video/mp4" />
                <source src={fileSrc} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-[40vh] w-full items-center justify-center bg-neutral-900 text-neutral-300">
                <div className="flex items-center gap-2 rounded-xl bg-neutral-800/60 px-4 py-3">
                  <AlertTriangle className="text-yellow-400" />
                  <div className="text-sm">
                    This video has no playable URL.
                    <div className="mt-1 text-xs text-neutral-400">
                      <span className="font-mono">videoUrl: </span>
                      <span className="font-mono break-all">
                        {rawUrl || "(empty)"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs">
                      Set a YouTube link (watch / shorts / share) or upload a
                      video file in Admin → Video.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">{data.title}</h1>
              <div className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-600">
                <Eye size={16} />
                <span>{data.viewCount ?? 0} views</span>
              </div>
            </div>

            <button
              onClick={handleLike}
              disabled={likeBusy}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-60"
              title="Like"
            >
              <Heart className="fill-red-500 text-red-500" size={18} />
              <span>{data.likeCount ?? 0}</span>
            </button>
          </div>

          {data.description && (
            <p className="mt-4 text-sm text-neutral-700">{data.description}</p>
          )}
        </>
      )}
    </div>
  );
}
