// src/utils/Testing/Video.jsx
import axios from "axios";
import Loader from "../../components/lorder-animate";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function VideoDetailsPage() {
  const [video, setVideo] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/video`)
        .then((res) => {
          setVideo(res.data || []);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load videos");
        });
    }
  }, [loaded]);

  async function confirmDelete(id) {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-72">
        <p className="text-sm text-gray-800">Are you sure you want to delete this video?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteVideo(id);
            }}
            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ));
  }

  async function deleteVideo(id) {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to delete a video");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/video/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Video deleted successfully");
      setLoaded(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete video");
    }
  }

  return (
    <div className="relative w-full h-full rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Videos</h2>

        <Link
          to="/admin/video/upload"
          className="inline-flex items-center rounded-lg bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
        >
          + Add Video
        </Link>
      </div>

      {loaded ? (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Video ID</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Duration</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Views</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {video.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-neutral-500" colSpan={7}>
                    No videos found.
                  </td>
                </tr>
              )}

              {video.map((vid, index) => (
                <tr key={vid.videoId || index} className="border-t border-black/10">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{vid.videoId}</td>
                  <td className="px-3 py-2">{vid.title}</td>
                  <td className="px-3 py-2">{vid.duration} sec</td>
                  <td className="px-3 py-2">{vid.description}</td>
                  <td className="px-3 py-2">{vid.viewCount}</td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/video/edit/${encodeURIComponent(vid.videoId)}`,
                            { state: vid }
                          )
                        }
                        className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => confirmDelete(vid.videoId)}
                        className="rounded-md bg-[#e30613] px-2 py-1 text-white hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
