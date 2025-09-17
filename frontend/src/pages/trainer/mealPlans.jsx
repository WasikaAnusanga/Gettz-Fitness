import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MealPlans() {
  // Data
  const [plans, setPlans] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState(null); // mealPlan_id when editing

  // Form (snake_case to match backend)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // -------- FETCH ----------
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
        err?.response?.data?.message || err?.message || "Failed to load meal plans";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  // -------- CREATE ----------
  async function onCreate(e) {
    e.preventDefault();

    if (!form.mealPlan_id || !form.user_id || !form.meal_name || !form.duration) {
      toast.error("Please fill Meal Plan ID, User ID, Meal Name, and Duration.");
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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/mealPlan`, payload);
      
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

  // -------- EDIT PREP ----------
  function startEdit(p) {
    setEditId(p.mealPlan_id);
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

  // -------- UPDATE ----------
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
          form.mealPlan_id
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

  // -------- DELETE ----------
  async function deletePlan(p) {
    const key = p.mealPlan_id ?? p._id; 
    if (!key) {
      toast.error("Missing id");
      return;
    }

    try {
      setBusy(true);
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL+"/api/mealPlan/"+key);
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

  // -------- SEARCH ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((p) => {
      const id = String(p.mealPlan_id ?? "").toLowerCase();
      const user = String(p.user_id ?? "").toLowerCase();
      const name = String(p.meal_name ?? "").toLowerCase();
      const desc = String(p.description ?? "").toLowerCase();
      const type = String(p.meal_type ?? "").toLowerCase();
      const dur = String(p.duration ?? "").toLowerCase();
      return (
        id.includes(q) ||
        user.includes(q) ||
        name.includes(q) ||
        desc.includes(q) ||
        type.includes(q) ||
        dur.includes(q)
      );
    });
  }, [query, plans]);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  return (
    <div className="p-6">
   
      <div className="mx-auto w-full max-w-screen-2xl">
  
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Meal Plans</h1>
          <div className="flex items-center gap-2">
            
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, user, name, type…"
                className="w-80 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>

           
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

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <div className="min-w-[1100px]">
            
            <div className="grid grid-cols-13 gap-x-8 gap-y-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-2">Meal Plan ID</div>
              <div className="col-span-2">User ID</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Description</div>
              <div className="col-span-2 pr-0">Type</div>
              <div className="col-span-1 text-right pr-2 md:pr-4 -ml-2">Duration</div>
              <div className="col-span-1 text-right pl-5 md:pl-7">Actions</div>
            </div>

            {busy ? (
              <div className="p-6 text-sm text-gray-500">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No meal plans found</div>
            ) : (
              filtered.map((p) => {
                const key = p._id ?? p.mealPlan_id;
                return (
                  <div
                    key={key}
                    className="grid grid-cols-13 gap-x-8 gap-y-4 px-6 py-3 text-sm text-gray-800 border-b last:border-none"
                  >
                    <div className="col-span-2 font-mono">{p.mealPlan_id ?? "-"}</div>
                    <div className="col-span-2">{p.user_id ?? "-"}</div>
                    <div className="col-span-2">{p.meal_name ?? "-"}</div>
                    <div className="col-span-2 truncate">{p.description ?? "-"}</div>
                    <div className="col-span-2 pr-0">{p.meal_type ?? "-"}</div>
                    <div className="col-span-1 text-right whitespace-nowrap pr-2 md:pr-4 -ml-2">
                      {p.duration ?? "-"}
                    </div>
                    <div className="col-span-1 pl-5 md:pl-7 min-w-[140px]">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePlan(p)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            
            <div className="mb-4 flex items-center justify-between">
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

            <form onSubmit={editId ? onUpdate : onCreate} className="space-y-3">
              <label className="text-sm block">
                <span className="mb-1 block font-medium">Meal Plan ID *</span>
                <input
                  name="mealPlan_id"
                  value={form.mealPlan_id}
                  onChange={handleChange}
                  required
                  disabled={!!editId}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 disabled:bg-gray-100"
                />
              </label>

              <label className="text-sm block">
                <span className="mb-1 block font-medium">User ID *</span>
                <input
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Meal Name *</span>
                  <input
                    name="meal_name"
                    value={form.meal_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. whole-grain cereals, oats"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Duration *</span>
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 3 months"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>
              </div>

              <label className="text-sm block">
                <span className="mb-1 block font-medium">Type</span>
                <input
                  name="meal_type"
                  value={form.meal_type}
                  onChange={handleChange}
                  placeholder="e.g. pre-workout, post-workout"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <label className="text-sm block">
                <span className="mb-1 block font-medium">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditId(null);
                    resetForm();
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  {editId ? "Update Meal Plan" : "Save Meal Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className={`pointer-events-none fixed left-0 top-0 h-0.5 bg-red-600 transition-all ${
          busy ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}
