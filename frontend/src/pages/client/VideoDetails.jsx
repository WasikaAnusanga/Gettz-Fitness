import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Heart, Eye, AlertTriangle } from "lucide-react";
import Header from "../../components/header";


const RAW_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

const endpoints = {
  getOne: (id) => `${API_BASE}/api/video/${id}`,
  addView: (id) => `${API_BASE}/api/video/${id}/view`,
  toggleLike: (id) => `${API_BASE}/api/video/${id}/like`,
};

function parseYouTubeId(url) {
  if (!url) return null;
  const raw = (url || "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const isYT = host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com";
    if (!isYT) return null;
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }
    const v = u.searchParams.get("v");
    if (v) return v;
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

export default function VideoDetails() {
  const { videoId } = useParams();
  const [data, setData] = useState(null);
  const [likeBusy, setLikeBusy] = useState(false);
  const viewKey = useMemo(() => `viewed:${(videoId || "").trim()}`, [videoId]);
  const likeKey = useMemo(() => `liked:${(videoId || "").trim()}`, [videoId]);

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

  const rawUrl = (data?.videoUrl || "").trim();
  const ytEmbed = useMemo(() => toYouTubeEmbed(rawUrl), [rawUrl]);
  const fileSrc = useMemo(() => {
    if (ytEmbed) return null;
    if (!rawUrl) return null;
    return normalizeDriveDirect(rawUrl);
  }, [ytEmbed, rawUrl]);

  useEffect(() => {
    if (!data) return;
    if (sessionStorage.getItem(viewKey)) return;
    sessionStorage.setItem(viewKey, "1");
    setData((d) => (d ? { ...d, viewCount: (d.viewCount || 0) + 1 } : d));
    axios
      .post(endpoints.addView(videoId))
      .then((res) => {
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
        sessionStorage.removeItem(viewKey);
        console.warn("view bump failed");
      });
  }, [data, videoId, viewKey]);

  async function handleLike() {
    if (!data || likeBusy) return;
    const alreadyLocal = localStorage.getItem(likeKey) === "1";
    setLikeBusy(true);
    setData((d) =>
      d ? { ...d, likeCount: (d.likeCount || 0) + (alreadyLocal ? -1 : 1) } : d
    );
    try {
      const res = await axios.post(endpoints.toggleLike(videoId), {
        delta: alreadyLocal ? -1 : 1,
      });
      if (alreadyLocal) localStorage.removeItem(likeKey);
      else localStorage.setItem(likeKey, "1");
      const { likeCount } = res.data || {};
      if (typeof likeCount === "number") {
        setData((d) => (d ? { ...d, likeCount } : d));
      }
    } catch (e) {
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
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-3xl px-2 md:px-0 pt-20">
        <div className="mb-6 flex items-center gap-2">
          <Link
            to="/videos"
            className="inline-flex items-center gap-1 text-sm text-red-500 hover:underline"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
        {!data ? (
          <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-black mb-6">
              {ytEmbed ? (
                <iframe
                  className="aspect-video w-full min-h-[220px] max-h-[60vh]"
                  src={ytEmbed}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : fileSrc ? (
                <video
                  className="aspect-video w-full min-h-[220px] max-h-[60vh]"
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
                      No playable video URL.
                      <div className="mt-1 text-xs text-neutral-400">
                        <span className="font-mono">videoUrl: </span>
                        <span className="font-mono break-all">{rawUrl || "(empty)"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 truncate">{data.title}</h1>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                  <Eye size={16} /> {data.viewCount ?? 0}
                </span>
                <button
                  onClick={handleLike}
                  disabled={likeBusy}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60 transition"
                  title="Like"
                >
                  <Heart className="fill-red-500 text-red-500" size={18} />
                  <span>{data.likeCount ?? 0}</span>
                </button>
              </div>
            </div>
            {data.description && (
              <p className="mt-2 text-base text-gray-700 whitespace-pre-line border-l-4 border-red-100 pl-4">{data.description}</p>
            )}
            {Array.isArray(data.workOutStep) && data.workOutStep.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Workout Steps</h2>
                <ol className="list-decimal pl-6 space-y-1">
                  {data.workOutStep.filter(Boolean).map((step, idx) => (
                    <li key={idx} className="text-base text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </main>
      
    </div>
  );
}
