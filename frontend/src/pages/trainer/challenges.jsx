import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";

export default function TrainerChallenges() {
  const [participations, setParticipations] = useState([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  // -------- SEARCH ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participations;
    return participations.filter((p) => {
      const challengeId = String(p.challengeID ?? "").toLowerCase();
      const title = String(p.title ?? "").toLowerCase();
      const points = String(p.points ?? "").toLowerCase();
      const userId = String(p.userID ?? "").toLowerCase();
      const userName = String(p.userName ?? "").toLowerCase();
      const status = p.completed ? "approved" : "pending";
      return (
        challengeId.includes(q) ||
        title.includes(q) ||
        points.includes(q) ||
        userId.includes(q) ||
        userName.includes(q) ||
        status.includes(q)
      );
    });
  }, [query, participations]);

  // -------- PDF (exports current filtered list) ----------
  const handleDownloadPDF = () => {
    const list = filtered;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor("#e30613");
    doc.text("Challenge Approvals Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "No",
          "Challenge ID",
          "Title",
          "Points",
          "Member Name",
          "Status",
        ],
      ],
      body: list.map((p, i) => [
        i + 1,
        p.challengeID ?? "-",
        p.title ?? "-",
        p.points ?? "-",
        p.userName ?? "-",
        p.completed ? "Approved" : "Pending",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 18 },
        4: { cellWidth: 22 },
        5: { cellWidth: 32 },
        6: { cellWidth: 22 },
      },
    });

    doc.save("challenge_approvals.pdf");
  };

  // Fetch all user challenge participations
  async function fetchParticipations() {
    setBusy(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/challenge/userchallenges`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParticipations(data || []);
    } catch (err) {
      toast.error("Failed to load challenge participations");
    } finally {
      setBusy(false);
    }
  }

  // Approve a user's challenge participation
  async function approveParticipation(userChallengeId) {
    setBusy(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/challenge/complete/${userChallengeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Challenge approved and points awarded!");
      fetchParticipations();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to approve challenge"
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchParticipations();
  }, []);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Challenge Approvals</h1>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by challenge, user, name…"
                className="w-80 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
            {/* Download PDF (green) */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Challenge ID</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Points</th>
                <th className="px-3 py-2 text-left">Member Name</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className="px-3 py-2" colSpan={8}>Loading…</td>
                </tr>
              )}
              {!busy && filtered.length === 0 && (
                <tr>
                  <td className="px-3 py-2" colSpan={8}>No participations found</td>
                </tr>
              )}
              {!busy && filtered.map((p, idx) => (
                <tr key={p._id} className="border-t border-black/10">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{p.challengeID}</td>
                  <td className="px-3 py-2">{p.title}</td>
                  <td className="px-3 py-2">{p.points}</td>
                  <td className="px-3 py-2">{p.userName}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${p.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.completed ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={p.completed ? "approved" : "pending"}
                      disabled={p.completed}
                      onChange={e => {
                        if (e.target.value === "approved" && !p.completed) {
                          approveParticipation(p.userChallengeId);
                        }
                      }}
                      className="rounded border px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}