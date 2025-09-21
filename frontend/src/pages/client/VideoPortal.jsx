import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../../components/VideoCard";
import toast from "react-hot-toast";
import Header from "../../components/header";

const RAW_BASE = import.meta.env.VITE_BACKEND_URL;
const API_BASE = RAW_BASE.replace(/\/+$/, "");

export default function VideoPortal() {
  const [videos, setVideos] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/video`)
      .then((res) => {
        setVideos(res.data || []);

        
        const cats = Array.from(
          new Set((res.data || []).map((v) => v.category).filter(Boolean))
        );
        setCategories(cats);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load videos");
        setVideos([]);
        setCategories([]);
      });
  }, []); 


  const filteredVideos = (videos || [])
    .filter((v) => v.isPublished !== false)
    .filter((v) => selectedCategory === "all" || v.category === selectedCategory)
    .filter((v) => {
      if (!search.trim()) return true;
      const s = search.trim().toLowerCase();
      return (
        (v.title && v.title.toLowerCase().includes(s)) ||
        (v.description && v.description.toLowerCase().includes(s))
      );
    });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-white mt-16">
        <aside className="w-64 border-r border-gray-200 px-4 py-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <div className="flex flex-col gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium text-left transition ${
                  selectedCategory === "all"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-lg font-medium text-left transition ${
                    selectedCategory === cat
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Search</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </aside>

        <main className="flex-1 mx-auto max-w-6xl px-6 py-6">
          {!videos ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl bg-neutral-200"
                />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No videos found for this filter.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {filteredVideos.map((v) => (
                <VideoCard key={v.videoId} v={v} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
