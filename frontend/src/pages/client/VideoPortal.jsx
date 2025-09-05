import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../../components/VideoCard";
import toast from "react-hot-toast";
import Lorder from "../../components/lorder-animate";
import { Loader } from "lucide-react";

const RAW_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

export default function VideoPortal() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/video`)
      .then((res) => setVideos(res.data || []))
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load videos");
        setVideos([]);
      });
  }, [Loader]);

  return (
    
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Video portal</h1>
          <p className="text-sm text-neutral-500">
            Explore training videos from our coaches.
          </p>
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
      ) : videos.length === 0 ? (
        <p className="text-sm text-neutral-500">No videos yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.videoId} v={v} />
          ))}
        </div>
      )}
    </div>
  );
}
