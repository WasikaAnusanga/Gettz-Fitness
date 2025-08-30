import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Video() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    altNames: "",
    tags: "",
    duration: "",
    videoUrl: "",
    isPublished: true,
  });

  const token = localStorage.getItem("token"); 

  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () =>
    setForm({
      title: "",
      description: "",
      altNames: "",
      tags: "",
      duration: "",
      videoUrl: "",
      isPublished: true,
    });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter((v) => {
      const title = v.title?.toLowerCase() || "";
      const tags = (v.tags || []).join(",").toLowerCase();
      const alts = (v.altNames || []).join(",").toLowerCase();
      const id = v.videoId?.toLowerCase() || "";
      return (
        title.includes(q) || tags.includes(q) || alts.includes(q) || id.includes(q)
      );
    });
  }, [query, videos]);


  async function fetchVideos() {
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/video/`,
        { headers: auth }
      );
      setVideos(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load videos";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      altNames: form.altNames
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      duration: Number(form.duration),
      videoUrl: form.videoUrl.trim(),
      isPublished: !!form.isPublished,
    };

    if (!payload.title || !payload.description || !payload.videoUrl || !form.duration) {
      toast.error("Please fill title, description, duration and video URL.");
      return;
    }
    if (!Number.isFinite(payload.duration) || payload.duration <= 0) {
      toast.error("Duration must be a positive number.");
      return;
    }

    try {
      setBusy(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/video/upload`,
        payload,
        { headers: auth }
      );
      toast.success(data?.message || "Video added");
      setOpen(false);
      resetForm();
      fetchVideos();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add video";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchVideos();
 
  }, []);


  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Videos</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tags, alt name, ID…"
                className="w-72 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Add Video
            </button>
          </div>
        </div>

        {/* list */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-4 py-3 text-xs font-semibold text-gray-500">
            <div className="col-span-2">Video ID</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Published</div>
            <div className="col-span-1 text-right">Views</div>
          </div>

          {busy ? (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No videos found.</div>
          ) : (
            filtered.map((v) => (
              <div
                key={v._id || v.videoId}
                className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-gray-800 border-b last:border-none"
              >
                <div className="col-span-2 font-mono">{v.videoId}</div>
                <div className="col-span-3">{v.title}</div>
                <div className="col-span-2 truncate">
                  {v.tags?.length ? v.tags.join(", ") : "-"}
                </div>
                <div className="col-span-2">{v.duration} min</div>
                <div className="col-span-2">
                  {v.isPublished ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      Draft
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-right">{v.viewCount ?? 0}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Video</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <label className="text-sm block">
                <span className="mb-1 block font-medium">Title *</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <label className="text-sm block">
                <span className="mb-1 block font-medium">Description *</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Alt names</span>
                  <input
                    name="altNames"
                    value={form.altNames}
                    onChange={handleChange}
                    placeholder="comma separated"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Tags</span>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. HIIT, Cardio"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Duration (min) *</span>
                  <input
                    type="number"
                    min="0"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Video URL *</span>
                  <input
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    required
                    placeholder="https://…"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2 text-sm pt-1">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                Publish immediately
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    
      <div
        className={`pointer-events-none fixed left-0 top-0 h-0.5 bg-red-600 transition-all ${
          busy ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}
