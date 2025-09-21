import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

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

  return requests.filter((r) =>
    String(r.request_id ?? "").toLowerCase().includes(q)
  );
}, [query, requests]);


  // Initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  // -------- PDF ----------
  const handleDownloadPDF = () => {
    const list = filtered; 
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
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] }, // black header
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 }, // Request ID
        2: { cellWidth: 40 }, // Name
        3: { cellWidth: 28 }, // Date
        4: { cellWidth: 20 }, // Weight
        5: { cellWidth: 20 }, // Height
        6: { cellWidth: 30 }, // Last Name
        7: { cellWidth: 50 }, // Description
        8: { cellWidth: 25 }, // Meal Type
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
                placeholder="Search by request id"
                className="w-80 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>

            {/* Download PDF */}
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
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 w-28">Request ID</th>
                <th className="px-4 py-3 w-40">First Name</th>
                <th className="px-4 py-3 w-40">Last Name</th>
                <th className="px-4 py-3 w-36">Requested Date</th>
                <th className="px-4 py-3 w-[360px]">Description</th>
                <th className="px-4 py-3 w-32">Meal Type</th>
                <th className="px-4 py-3 w-24">Weight</th>
                <th className="px-4 py-3 w-24">Height</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {busy && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    No requests found
                  </td>
                </tr>
              )}

              {!busy &&
                filtered.map((r) => {
                  const key = r._id ?? r.request_id;
                  return (
                    <tr key={key} className="align-top">
                      <td className="px-4 py-3 font-mono">
                        {String(r.request_id ?? "-")}
                      </td>
                      <td className="px-4 py-3">{r.user_name ?? "-"}</td>
                      <td className="px-4 py-3">{r.last_name ?? "-"}</td>
                      <td className="px-4 py-3">
                        {r.request_date
                          ? String(r.request_date).slice(0, 10)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-pre-line break-words">
                        {r.description ?? "-"}
                      </td>
                      <td className="px-4 py-3">{r.mealType ?? "-"}</td>
                      <td className="px-4 py-3">{r.weight ?? "-"}</td>
                      <td className="px-4 py-3">{r.height ?? "-"}</td>
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
