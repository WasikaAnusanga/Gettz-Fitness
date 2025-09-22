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

  // Assign modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    request_id: "",
    user_name: "",
    last_name: "",
    request_date: "",
    description: "",
    mealType: "Non-Vegan",
    weight: "",
    height: "",
    user_id: "",
    // NEW meal-plan fields
    mealName: "",
    duration: "",
    calories: "",
    planDescription: "",
    planMealType: "",
  });

  // -------- FETCH ----------
  async function fetchRequests() {
    try {
      setBusy(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: "Bearer " + token } : undefined;

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealRequest`,
        { headers }
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
      String(r.request_id ?? "")
        .toLowerCase()
        .includes(q)
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
        [
          "Request ID",
          "User ID",
          "First Name",
          "Last Name",
          "Requested Date",
          "Description",
          "Meal Type",
          "Weight",
          "Height",
        ],
      ],
      body: list.map((r) => [
        String(r.request_id ?? "-"),
        r.user_id ?? "-",
        r.user_name ?? "-",
        r.last_name ?? "-",
        r.request_date ? String(r.request_date).slice(0, 10) : "-",
        r.description ?? "-",
        r.mealType ?? "-",
        r.weight ?? "-",
        r.height ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 28 },
        5: { cellWidth: 50 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 },
      },
    });

    doc.save("requested_meals.pdf");
  };

  // ---- UI helpers ----
  const label = "block mb-1 text-sm font-medium text-black";
  const input =
    "w-full border border-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2";

  // ---- Assign helpers ----
  function openAssign(row) {
    setAssignForm({
      request_id: row.request_id ?? "",
      user_name: row.user_name ?? "",
      last_name: row.last_name ?? "",
      request_date: row.request_date
        ? String(row.request_date).slice(0, 10)
        : "",
      description: row.description ?? "",
      mealType: row.mealType ?? "Non-Vegan",
      weight: row.weight ?? "",
      height: row.height ?? "",
      user_id: row.user_id ?? "",

      // meal-plan defaults
      mealName: "",
      duration: "",
      calories: "",
      planDescription: "",
      planMealType: "",
    });

    setAssignOpen(true);
  }

  async function handleAssignSubmit(e) {
    e.preventDefault();

    const payload = {
      meal_name: assignForm.mealName,
      duration: assignForm.duration,
      calaries: assignForm.calories, // backend uses "calaries"
      description: assignForm.planDescription,
      meal_type: assignForm.planMealType,
      user_id: assignForm.user_id,
    };

    try {
      setBusy(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan`,
        payload
      );
      toast.success("Meal plan added");
      setAssignOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add meal plan";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">User Requests</h1>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by request id"
                className="w-80 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>

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
                <th className="px-4 py-3 w-40 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {busy && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
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
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => openAssign(r)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {assignOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-start justify-center p-3">
            <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl my-10 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between rounded-t-xl border-b px-4 py-3 sticky top-0 bg-white">
                <h2 className="text-base font-semibold text-black">
                  Assign Meal Plan
                </h2>
                <button
                  onClick={() => setAssignOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleAssignSubmit}
                className="space-y-5 p-4"
                noValidate
              >
                {/* TWO-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT: Request Snapshot (disabled, two columns) */}
                  {/* LEFT: Request Snapshot (READ-ONLY, decorated) */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                      Request Snapshot
                    </h3>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {/* Request ID - full width */}
                        <div className="sm:col-span-2">
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Request ID
                          </dt>
                          <dd className="mt-1 font-mono text-sm text-gray-900 break-all rounded-md bg-white/80 ring-1 ring-gray-200 px-2 py-1">
                            {assignForm.request_id || "-"}
                          </dd>
                        </div>

                        {/* Name */}
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            First Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {assignForm.user_name || "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Last Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {assignForm.last_name || "-"}
                          </dd>
                        </div>

                        {/* Request Date */}
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Request Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {assignForm.request_date || "-"}
                          </dd>
                        </div>

                        {/* Requested Meal Type as a pill */}
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Requested Meal Type
                          </dt>
                          <dd className="mt-1">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
                              {assignForm.mealType || "-"}
                            </span>
                          </dd>
                        </div>

                        {/* Weight / Height */}
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Weight (kg)
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {assignForm.weight || "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Height (cm)
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {assignForm.height || "-"}
                          </dd>
                        </div>

                        {/* Description - full width, subtle box */}
                        <div className="sm:col-span-2">
                          <dt className="text-[11px] uppercase tracking-wide text-gray-500">
                            Request Description
                          </dt>
                          <dd className="mt-1 rounded-lg bg-white/80 ring-1 ring-gray-200 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                            {assignForm.description || "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* RIGHT: Meal Plan Details (active fields) */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                      Meal Plan Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={label}>Meal Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Whole-grain cerials, oats"
                          value={assignForm.mealName}
                          onChange={(e) =>
                            setAssignForm({
                              ...assignForm,
                              mealName: e.target.value,
                            })
                          }
                          className={input}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={label}>Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 3 months"
                            value={assignForm.duration}
                            onChange={(e) =>
                              setAssignForm({
                                ...assignForm,
                                duration: e.target.value,
                              })
                            }
                            className={input}
                          />
                        </div>
                        <div>
                          <label className={label}>Calories</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g., 450"
                            value={assignForm.calories}
                            onChange={(e) =>
                              setAssignForm({
                                ...assignForm,
                                calories: e.target.value,
                              })
                            }
                            className={input}
                            min={0}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={label}>Description</label>
                        <textarea
                          rows={3}
                          placeholder="Extra guidance for the meal plan"
                          value={assignForm.planDescription}
                          onChange={(e) =>
                            setAssignForm({
                              ...assignForm,
                              planDescription: e.target.value,
                            })
                          }
                          className={input}
                        />
                      </div>
                      <div>
                        <label className={label}>Meal Type</label>
                        <input
                          type="text"
                          placeholder="e.g., Pre-workout, Post-workout"
                          value={assignForm.planMealType}
                          onChange={(e) =>
                            setAssignForm({
                              ...assignForm,
                              planMealType: e.target.value,
                            })
                          }
                          className={input}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setAssignOpen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
