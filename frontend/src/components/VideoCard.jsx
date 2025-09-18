import { Play, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function ytThumb(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube") || u.hostname.includes("youtu.be")) {
      const id =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
      if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {}
  return null;
}

export default function VideoCard({ v }) {
  const thumb = ytThumb(v.videoUrl);

  return (
    <Link
      to={`/videos/${encodeURIComponent(v.videoId)}`}
      className="group block rounded-2xl border border-black/10 bg-white hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative aspect-video bg-gradient-to-br from-neutral-200 to-neutral-100">
        {thumb ? (
          <img
            src={thumb}
            alt={v.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-neutral-400">
            <Play className="h-10 w-10" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
          <Eye size={14} />
          {v.viewCount ?? 0}
        </div>
      </div>

      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium">{v.title}</p>
      </div>
    </Link>
  );
}
