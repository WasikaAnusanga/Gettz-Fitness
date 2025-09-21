import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MealPlans() {
  const [plans, setPlans] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    mealPlan_id: "",
    user_id: "",
    meal_name: "",
    description: "",
    meal_type: "",
    duration: "",
  });

  const resetForm = () =>
    setForm({
      mealPlan_id: "",
      user_id: "",
      meal_name: "",
      description: "",
      meal_type: "",
      duration: "",
    });

  async function fetchMealPlans() {
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan`
      );
      const items = Array.isArray(data?.response) ? data.response : [];
      setPlans(items);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load meal plans";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchMealPlans();
  }, []);

  async function onCreate(e) {
    e.preventDefault();

    if (
      !form.mealPlan_id ||
      !form.user_id ||
      !form.meal_name ||
      !form.duration
    ) {
      toast.error(
        "Please fill Meal Plan ID, User ID, Meal Name, and Duration."
      );
      return;
    }

    const payload = {
      mealPlan_id: Number(form.mealPlan_id),
      user_id: Number(form.user_id),
      meal_name: form.meal_name.trim(),
      description: form.description.trim(),
      meal_type: form.meal_type.trim(),
      duration: String(form.duration).trim(),
    };

    try {
      setBusy(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan`,
        payload
      );
      toast.success("Meal plan added");
      setOpen(false);
      resetForm();
      fetchMealPlans();
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

  function startEdit(p) {
    setEditId(p.mealPlan_id ?? null);
    setForm({
      mealPlan_id: p.mealPlan_id ?? "",
      user_id: p.user_id ?? "",
      meal_name: p.meal_name ?? "",
      description: p.description ?? "",
      meal_type: p.meal_type ?? "",
      duration: p.duration ?? "",
    });
    setOpen(true);
  }

  async function onUpdate(e) {
    e.preventDefault();
    if (!editId) {
      toast.error("Missing mealPlan_id for update");
      return;
    }

    const payload = {
      mealPlan_id: Number(form.mealPlan_id),
      user_id: Number(form.user_id),
      meal_name: form.meal_name.trim(),
      description: form.description.trim(),
      meal_type: form.meal_type.trim(),
      duration: String(form.duration).trim(),
    };

    try {
      setBusy(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan/${encodeURIComponent(
          editId
        )}`,
        payload
      );
      toast.success("Meal plan updated");
      setOpen(false);
      setEditId(null);
      resetForm();
      fetchMealPlans();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update meal plan";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  async function deletePlan(p) {
    if (!p.mealPlan_id) {
      toast.error("Missing id");
      return;
    }
    try {
      setBusy(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan/${encodeURIComponent(
          p.mealPlan_id
        )}`
      );
      toast.success("Meal plan deleted");
      fetchMealPlans();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete meal plan";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  const handleDownloadPDF = () => {
    const list = plans;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor("#e30613");
    doc.text("Meal Plans Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "No",
          "Meal Plan ID",
          "User ID",
          "Name",
          "Description",
          "Type",
          "Duration",
        ],
      ],
      body: list.map((p, i) => [
        i + 1,
        p.mealPlan_id ?? "-",
        p.user_id ?? "-",
        p.meal_name ?? "-",
        p.description ?? "-",
        p.meal_type ?? "-",
        p.duration ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 22 },
        3: { cellWidth: 40 },
        4: { cellWidth: 50 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },
    });

    doc.save("meal_plans.pdf");
  };

  const headerCell = "px-3 py-2 text-left";
  const cell = "px-3 py-2";

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Meal Plans</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
            >
              Download PDF
            </button>

            <button
              type="button"
              onClick={() => {
                setEditId(null);
                resetForm();
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Add Meal Plan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className={headerCell}>Meal Plan ID</th>
                <th className={headerCell}>User ID</th>
                <th className={headerCell}>Name</th>
                <th className={headerCell}>Description</th>
                <th className={headerCell}>Type</th>
                <th className={headerCell}>Duration</th>
                <th className={headerCell}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {busy && (
                <tr>
                  <td className={cell} colSpan={8}>
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && plans.length === 0 && (
                <tr>
                  <td className={cell} colSpan={8}>
                    No meal plans found
                  </td>
                </tr>
              )}

              {!busy &&
                plans.map((p) => {
                  const key = p._id ?? p.mealPlan_id;
                  return (
                    <tr key={key} className="border-t border-black/10">
                      <td className={`${cell} font-mono`}>
                        {p.mealPlan_id ?? "-"}
                      </td>
                      <td className={cell}>{p.user_id ?? "-"}</td>
                      <td className={cell}>{p.meal_name ?? "-"}</td>
                      <td className={`${cell} max-w-[320px] truncate`}>
                        {p.description ?? "-"}
                      </td>
                      <td className={cell}>{p.meal_type ?? "-"}</td>
                      <td className={cell}>{p.duration ?? "-"}</td>
                      <td className={cell}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePlan(p)}
                            className="rounded-md bg-[#e30613] px-2 py-1 text-white hover:opacity-90"
                          >
                            Delete
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-2xl border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                {editId ? "Update Meal Plan" : "Add Meal Plan"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditId(null);
                  resetForm();
                }}
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={editId ? onUpdate : onCreate}
              className="space-y-6 p-6"
            >
              {/* Full width: Meal Plan ID */}
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Meal Plan ID *</span>
                <p className="text-xs text-gray-500 mb-2">
                  Unique identifier for this plan.
                </p>
                <input
                  name="mealPlan_id"
                  value={form.mealPlan_id}
                  onChange={(e) =>
                    setForm({ ...form, mealPlan_id: e.target.value })
                  }
                  required
                  disabled={!!editId}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 disabled:bg-gray-100"
                />
              </label>

              {/* Two columns */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">User ID *</span>
                  <p className="text-xs text-gray-500 mb-2">
                    ID of the user the plan belongs to.
                  </p>
                  <input
                    name="user_id"
                    value={form.user_id}
                    onChange={(e) =>
                      setForm({ ...form, user_id: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Meal Name *</span>
                  <p className="text-xs text-gray-500 mb-2">
                    Name of the meal.
                  </p>
                  <input
                    name="meal_name"
                    value={form.meal_name}
                    onChange={(e) =>
                      setForm({ ...form, meal_name: e.target.value })
                    }
                    required
                    placeholder="e.g. Whole-grain cereals, oats"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Type</span>
                  <p className="text-xs text-gray-500 mb-2">
                    Type of the meal
                  </p>
                  <input
                    name="meal_type"
                    value={form.meal_type}
                    onChange={(e) =>
                      setForm({ ...form, meal_type: e.target.value })
                    }
                    placeholder="e.g. Pre-workout, Post-workout"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium">Duration *</span>
                  <p className="text-xs text-gray-500 mb-2">
                    How long the plan runs.
                  </p>
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    required
                    placeholder="e.g. 3 months"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>
              </div>

              {/* Full width: Description */}
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Description</span>
                <p className="text-xs text-gray-500 mb-2">
                  Notes, goals, or any extra guidance.
                </p>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditId(null);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  {editId ? "Update Meal Plan" : "Save Meal Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
