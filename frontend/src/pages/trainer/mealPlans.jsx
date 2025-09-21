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
    user_name: "",
    meal_name: "",
    description: "",
    meal_type: "",
    duration: "",
    calaries: "",
  });

  const resetForm = () =>
    setForm({
      user_name: "",
      meal_name: "",
      description: "",
      meal_type: "",
      duration: "",
      calaries: "",
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

    const payload = {
      user_name: String(form.user_name).trim(),
      meal_name: form.meal_name.trim(),
      description: form.description.trim(),
      meal_type: form.meal_type.trim(),
      duration: String(form.duration).trim(),
      calaries: String(form.calaries).trim(),
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
    setEditId(p.mealPlan_id);
    setForm({
      user_name: p.user_name ?? "",
      meal_name: p.meal_name ?? "",
      description: p.description ?? "",
      meal_type: p.meal_type ?? "",
      duration: p.duration ?? "",
      calaries: p.calaries ?? "",
    });
    setOpen(true);
  }

  async function onUpdate(e) {
    e.preventDefault();

    const payload = {
      user_name: String(form.user_name).trim(),
      meal_name: form.meal_name.trim(),
      description: form.description.trim(),
      meal_type: form.meal_type.trim(),
      duration: String(form.duration).trim(),
      calaries: String(form.calaries).trim(),
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
    const titleY = 10;
    doc.setFontSize(16);
    doc.setTextColor("#e30613");
    doc.text("Meal Plans Report\n", 14, 16);
    autoTable(doc, {
      startY: titleY + 10,
      head: [
        [
          "Meal Plan ID",
          "User Name",
          "Meal Name",
          "Meal Type",
          "Duration",
          "Calaries",
          "Description",
        ],
      ],
      body: plans.map((p) => [
        p.mealPlan_id ?? "-",
        p.user_name ?? "-",
        p.meal_name ?? "-",
        p.meal_type ?? "-",
        p.duration ?? "-",
        p.calaries ?? "-",
        p.description ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
    });

    doc.save("meal_plans.pdf");
  };

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

        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 w-28">Meal Plan ID</th>
                <th className="px-4 py-3 w-28">User Name</th>
                <th className="px-4 py-3 w-40">Meal Name</th>
                <th className="px-4 py-3 w-32">Meal Type</th>
                <th className="px-4 py-3 w-28">Duration</th>
                <th className="px-4 py-3 w-20">Calaries</th>
                <th className="px-4 py-3 w-60">Description</th>
                <th className="px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {busy && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && plans.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    No meal plans found
                  </td>
                </tr>
              )}

              {!busy &&
                plans.map((p) => {
                  const key = p._id ?? p.mealPlan_id;
                  return (
                    <tr key={key} className="align-top">
                      <td className="px-4 py-3 font-mono">
                        {p.mealPlan_id ?? "-"}
                      </td>
                      <td className="px-4 py-3">{p.user_name ?? "-"}</td>
                      <td className="px-4 py-3">{p.meal_name ?? "-"}</td>
                      <td className="px-4 py-3">{p.meal_type ?? "-"}</td>
                      <td className="px-4 py-3">{p.duration ?? "-"}</td>
                      <td className="px-4 py-3">{p.calaries ?? "-"}</td>
                      <td className="px-4 py-3 whitespace-pre-line break-words">
                        {p.description ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePlan(p)}
                            className="rounded-md bg-red-600 px-2 py-1 text-white  hover:bg-red-700"
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium">User Name *</span>
                  <p className="text-xs text-gray-500 mb-2">
                    Name of the user the plan belongs to.
                  </p>
                  <input
                    name="user_name"
                    value={form.user_name}
                    onChange={(e) =>
                      setForm({ ...form, user_name: e.target.value })
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
                  <p className="text-xs text-gray-500 mb-2">Type of the meal</p>
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
                  <span className="mb-1 block font-medium">
                    No of Calaries{" "}
                  </span>
                  <p className="text-xs text-gray-500 mb-2">
                    Amount of calaries in the meal.
                  </p>
                  <input
                    name="calaries"
                    value={form.calaries}
                    onChange={(e) =>
                      setForm({ ...form, calaries: e.target.value })
                    }
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
