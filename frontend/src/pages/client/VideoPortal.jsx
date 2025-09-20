import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../../components/VideoCard";
import toast from "react-hot-toast";
import Lorder from "../../components/lorder-animate";
import { Loader } from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/footer";


const RAW_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
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
    
        const cats = Array.from(new Set((res.data || []).map(v => v.category).filter(Boolean)));
        setCategories(cats);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load videos");
        setVideos([]);
        setCategories([]);
      });
  }, [Loader]);



  const filteredVideos = (videos || [])
    .filter(v => v.isPublished !== false)
    .filter(v => selectedCategory === "all" || v.category === selectedCategory)
    .filter(v => {
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
      {/* Category Bar */}
      <div className="w-full bg-white border-b border-gray-200 px-4 pt-6 pb-2 sticky top-0 z-10">
        <div className="flex flex-wrap gap-2 md:gap-4 overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${selectedCategory === "all" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${selectedCategory === cat ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 w-full flex bg-white">
        
        <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Video portal</h1>
              <p className="text-sm text-neutral-500">
                Explore training videos from our coaches.
              </p>
            </div>
            <div className="w-full md:w-72">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
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
            <p className="text-sm text-neutral-500">No videos found for this filter.</p>
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
