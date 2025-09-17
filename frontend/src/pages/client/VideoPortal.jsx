
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
      <div className="flex-1 w-full pt-16 flex bg-white">
        
        <aside className="hidden md:block w-60 border-r border-gray-200 bg-gray-50 px-4 py-8">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition font-medium ${selectedCategory === "all" ? "bg-red-500 text-white" : "hover:bg-gray-200 text-gray-700"}`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition font-medium ${selectedCategory === cat ? "bg-red-500 text-white" : "hover:bg-gray-200 text-gray-700"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        
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
      <Footer />
    </div>
  );
}
