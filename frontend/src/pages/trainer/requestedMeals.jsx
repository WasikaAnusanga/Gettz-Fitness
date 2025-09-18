import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MealPlans() {
  // Data
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI state
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="p-6">
      {/* Wider page */}
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
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          {/* Give inner a min width so columns breathe on small screens */}
          <div className="min-w-[1100px]">
            {/* Header row (12-column grid; 6 x col-span-2 = 12) */}
            <div className="grid grid-cols-12 gap-x-8 gap-y-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-2">Request ID</div>
              <div className="col-span-2">User ID</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Requested Date</div>
              <div className="col-span-2">Weight</div>
              <div className="col-span-2">Height</div>
            </div>

            {busy ? (
              <div className="p-6 text-sm text-gray-500">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No requests found</div>
            ) : (
              filtered.map((r) => {
                const key = r._id ?? r.request_id;
                return (
                  <div
                    key={key}
                    className="grid grid-cols-12 gap-x-8 gap-y-4 px-6 py-3 text-sm text-gray-800 border-b last:border-none"
                  >
                    <div className="col-span-2 font-mono">
                      {String(r.request_id ?? "-")}
                    </div>
                    <div className="col-span-2">
                      {r.user_id ?? "-"}
                    </div>
                    <div className="col-span-2">
                      {r.user_name ?? "-"}
                    </div>
                    <div className="col-span-2">
                      {r.request_date ?? "-"}
                    </div>
                    <div className="col-span-2">
                      {r.weight ?? "-"}
                    </div>
                    <div className="col-span-2">
                      {r.height ?? "-"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
