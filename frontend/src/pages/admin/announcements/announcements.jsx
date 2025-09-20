// src/utils/Testing/Video.jsx
import axios from "axios";
import Loader from "../../../components/lorder-animate";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function AnnouncementDetailsPage() {
  const [announcement, setAnnouncement] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/notification`)
        .then((res) => {
          setAnnouncement(res.data || []);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load announcements");
        });
    }
  }, [loaded]);

  async function confirmDelete(id) {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-72">
        <p className="text-sm text-gray-800">Are you sure you want to delete this announcement?</p>
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
              deleteAnnouncement(id);
            }}
            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ));
  }

  async function deleteAnnouncement(id) {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in to delete an announcement");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Announcement deleted successfully");
      setLoaded(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    }
  }

  // Filter announcements by title, type, or deliveryTo
  const filteredAnnouncements = announcement.filter((notifi) => {
    const term = searchTerm.toLowerCase();
    return (
      notifi.title?.toLowerCase().includes(term) ||
      notifi.type?.toLowerCase().includes(term) ||
      notifi.deliveryTo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="relative w-full h-full rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Announcements</h2>

        <Link
          to="/admin/announcement/upload"
          className="inline-flex items-center rounded-lg bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
        >
          + Add Announcement
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e30613]"
        />
      </div>

      {loaded ? (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Announcement ID</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Delivery To</th>
                <th className="px-3 py-2 text-left">Created By</th>
                <th className="px-3 py-2 text-left">Sent Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-neutral-500" colSpan={7}>
                    No announcements found.
                  </td>
                </tr>
              )}

              {filteredAnnouncements.map((notifi, index) => (
                <tr key={notifi.notificationId || index} className="border-t border-black/10">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{notifi.notificationID}</td>
                  <td className="px-3 py-2">{notifi.type}</td>
                  <td className="px-3 py-2">{notifi.title}</td>
                  <td className="px-3 py-2">{notifi.deliveryTo}</td>
                  <td className="px-3 py-2">{notifi.createdBy}</td>
                  <td className="px-3 py-2">{new Date(notifi.createdAt).toLocaleDateString()}</td>
                  {/* <td className="px-3 py-2">{notifi.sentDate}</td> */}

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/announcement/edit/${encodeURIComponent(notifi._id)}`,
                            { state: notifi }
                          )
                        }
                        className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => confirmDelete(notifi._id)}
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
