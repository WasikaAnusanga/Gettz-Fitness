import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RequestedMeals() {
  // Data
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI
  const [query, setQuery] = useState("");

  // -------- FETCH ----------
  async function fetchRequests() {
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealRequest`
      );
      const items = Array.isArray(data?.response) ? data.response : [];
      setRequests(items);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load requests";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  // -------- SEARCH ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter((r) => {
      const requestId = String(r.request_id ?? "").toLowerCase();
      const userId = String(r.user_id ?? "").toLowerCase();
      const userName = String(r.user_name ?? "").toLowerCase();
      const reqDate = String(r.request_date ?? "").toLowerCase();
      const weight = String(r.weight ?? "").toLowerCase();
      const height = String(r.height ?? "").toLowerCase();

      return (
        requestId.includes(q) ||
        userId.includes(q) ||
        userName.includes(q) ||
        reqDate.includes(q) ||
        weight.includes(q) ||
        height.includes(q)
      );
    });
  }, [query, requests]);

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  // -------- PDF (exports current filtered list) ----------
  const handleDownloadPDF = () => {
    const list = filtered; // export what user sees
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor("#e30613");
    doc.text("Requested Meals Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "No",
          "Request ID",
          "User ID",
          "Name",
          "Requested Date",
          "Weight",
          "Height",
        ],
      ],
      body: list.map((r, i) => [
        i + 1,
        String(r.request_id ?? "-"),
        r.user_id ?? "-",
        r.user_name ?? "-",
        r.request_date ? String(r.request_date).slice(0, 10) : "-",
        r.weight ?? "-",
        r.height ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] }, // black header
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 }, // No
        1: { cellWidth: 25 }, // Request ID
        2: { cellWidth: 22 }, // User ID
        3: { cellWidth: 40 }, // Name
        4: { cellWidth: 28 }, // Date
        5: { cellWidth: 20 }, // Weight
        6: { cellWidth: 20 }, // Height
      },
    });

    doc.save("requested_meals.pdf");
  };

  // ---- UI helpers ----
  const headerCell = "px-3 py-2 text-left";
  const cell = "px-3 py-2";

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">User Requests</h1>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by request id, user, name…"
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

        {/* Video.jsx-style table container */}
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className={headerCell}>No</th>
                <th className={headerCell}>Request ID</th>
                <th className={headerCell}>User ID</th>
                <th className={headerCell}>Name</th>
                <th className={headerCell}>Requested Date</th>
                <th className={headerCell}>Weight</th>
                <th className={headerCell}>Height</th>
              </tr>
            </thead>

            <tbody>
              {busy && (
                <tr>
                  <td className={cell} colSpan={7}>
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && filtered.length === 0 && (
                <tr>
                  <td className={cell} colSpan={7}>
                    No requests found
                  </td>
                </tr>
              )}

              {!busy &&
                filtered.map((r, idx) => {
                  const key = r._id ?? r.request_id;
                  return (
                    <tr key={key} className="border-t border-black/10">
                      <td className={cell}>{idx + 1}</td>
                      <td className={`${cell} font-mono`}>
                        {String(r.request_id ?? "-")}
                      </td>
                      <td className={cell}>{r.user_id ?? "-"}</td>
                      <td className={cell}>{r.user_name ?? "-"}</td>
                      <td className={cell}>
                        {r.request_date
                          ? String(r.request_date).slice(0, 10)
                          : "-"}
                      </td>
                      <td className={cell}>{r.weight ?? "-"}</td>
                      <td className={cell}>{r.height ?? "-"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top progress bar */}
      <div
        className={`pointer-events-none fixed left-0 top-0 h-0.5 bg-red-600 transition-all ${
          busy ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}
