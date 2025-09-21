import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom"; // ✅ add this

export default function RequestedMeals() {
  // Data
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI
  const [query, setQuery] = useState("");

  const navigate = useNavigate(); // ✅ add this

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
      const lastName = String(r.last_name ?? "").toLowerCase();
      const description = String(r.description ?? "").toLowerCase();
      const mealType = String(r.mealType ?? "").toLowerCase();
      const birthday = String(r.birthday ?? "").toLowerCase();

      return (
        requestId.includes(q) ||
        userId.includes(q) ||
        userName.includes(q) ||
        reqDate.includes(q) ||
        weight.includes(q) ||
        height.includes(q) ||
        lastName.includes(q) ||
        description.includes(q) ||
        mealType.includes(q) ||
        birthday.includes(q)
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
        ["Request ID", "User ID", "Name", "Requested Date", "Weight", "Height"],
      ],
      body: list.map((r) => [
        String(r.request_id ?? "-"),
        r.user_id ?? "-",
        r.user_name ?? "-",
        r.request_date ? String(r.request_date).slice(0, 10) : "-",
        r.weight ?? "-",
        r.height ?? "-",
        r.last_name ?? "-",
        r.description ?? "-",
        r.mealType ?? "-",
        r.birthday ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] }, // black header
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 }, // Request ID
        1: { cellWidth: 22 }, // User ID
        2: { cellWidth: 40 }, // Name
        3: { cellWidth: 28 }, // Date
        4: { cellWidth: 20 }, // Weight
        5: { cellWidth: 20 }, // Height
        6: { cellWidth: 30 }, // Last Name
        7: { cellWidth: 50 }, // Description
        8: { cellWidth: 25 }, // Meal Type
        9: { cellWidth: 25 }, // Birthday
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

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className={headerCell}>Request ID</th>
                <th className={headerCell}>User ID</th>
                <th className={headerCell}>First Name</th>
                <th className={headerCell}>Last Name</th>
                <th className={headerCell}>Requested Date</th>
                <th className={headerCell}>Description</th>
                <th className={headerCell}>Meal Type</th>
                <th className={headerCell}>Weight</th>
                <th className={headerCell}>Height</th>
                <th className={headerCell}>Birthday</th>
              </tr>
            </thead>

            <tbody>
              {busy && (
                <tr>
                  <td className={cell} colSpan={6}>
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && filtered.length === 0 && (
                <tr>
                  <td className={cell} colSpan={6}>
                    No requests found
                  </td>
                </tr>
              )}

              {!busy &&
                filtered.map((r) => {
                  const key = r._id ?? r.request_id;
                  return (
                    <tr key={key} className="border-t border-black/10">
                      <td className={`${cell} font-mono`}>
                        {String(r.request_id ?? "-")}
                      </td>
                      <td className={cell}>{r.user_id ?? "-"}</td>
                      <td className={cell}>{r.user_name ?? "-"}</td>
                      <td className={cell}>{r.last_name ?? "-"}</td>
                      <td className={cell}>
                        {r.request_date
                          ? String(r.request_date).slice(0, 10)
                          : "-"}
                      </td>
                      <td className={cell}>{r.description ?? "-"}</td>
                      <td className={cell}>{r.mealType ?? "-"}</td>
                      <td className={cell}>{r.weight ?? "-"}</td>
                      <td className={cell}>{r.height ?? "-"}</td>
                      <td className={cell}>{r.birthday ?? "-"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
