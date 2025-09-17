import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Salaries() {
  // Data
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState(null); // salary_id when editing

  // Form (snake_case to match backend)
  const [form, setForm] = useState({
    salary_id: "",
    base_salary: "",
    pay_method: "",
    pay_date: "", // yyyy-mm-dd
    overtime_payment: "",
    workshift_schedule: "",
    attendance_count: "",
    leave_count: "",
    performance_notes: "",
  });

  const resetForm = () =>
    setForm({
      salary_id: "",
      base_salary: "",
      pay_method: "",
      pay_date: "",
      overtime_payment: "",
      workshift_schedule: "",
      attendance_count: "",
      leave_count: "",
      performance_notes: "",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // -------- FETCH ----------
  async function fetchSalaries() {
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employeeSalary`
      );
      const list = Array.isArray(data?.response) ? data.response : [];
      setItems(list);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load salaries";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  // -------- CREATE ----------
  async function onCreate(e) {
    e.preventDefault();

    if (
      !form.salary_id ||
      !form.base_salary ||
      !form.pay_method ||
      !form.pay_date
    ) {
      toast.error(
        "Please fill Salary ID, Base Salary, Pay Method, and Pay Date."
      );
      return;
    }

    const payload = {
      salary_id: Number(form.salary_id),
      base_salary: Number(form.base_salary),
      pay_method: String(form.pay_method || "").trim(),
      pay_date: String(form.pay_date || "").trim(),
      overtime_payment:
        form.overtime_payment === "" ? 0 : Number(form.overtime_payment),
      workshift_schedule: String(form.workshift_schedule || "").trim(),
      attendance_count:
        form.attendance_count === "" ? 0 : Number(form.attendance_count),
      leave_count: form.leave_count === "" ? 0 : Number(form.leave_count),
      performance_notes: String(form.performance_notes || "").trim(),
    };

    try {
      setBusy(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/employeeSalary`,
        payload
      );
      toast.success("Salary record added");
      setOpen(false);
      resetForm();
      fetchSalaries();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add salary record";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  // -------- EDIT PREP ----------
  function startEdit(p) {
    setEditId(p.salary_id);
    setForm({
      salary_id: p.salary_id ?? "",
      base_salary: p.base_salary ?? "",
      pay_method: p.pay_method ?? "",
      pay_date: (p.pay_date ?? "").slice(0, 10), // ensure yyyy-mm-dd for <input type="date">
      overtime_payment: p.overtime_payment ?? "",
      workshift_schedule: p.workshift_schedule ?? "",
      attendance_count: p.attendance_count ?? "",
      leave_count: p.leave_count ?? "",
      performance_notes: p.performance_notes ?? "",
    });
    setOpen(true);
  }

  // -------- UPDATE ----------
  async function onUpdate(e) {
    e.preventDefault();
    if (!editId) {
      toast.error("Missing salary_id for update");
      return;
    }

    const payload = {
      salary_id: Number(form.salary_id),
      base_salary: Number(form.base_salary),
      pay_method: String(form.pay_method || "").trim(),
      pay_date: String(form.pay_date || "").trim(),
      overtime_payment:
        form.overtime_payment === "" ? 0 : Number(form.overtime_payment),
      workshift_schedule: String(form.workshift_schedule || "").trim(),
      attendance_count:
        form.attendance_count === "" ? 0 : Number(form.attendance_count),
      leave_count: form.leave_count === "" ? 0 : Number(form.leave_count),
      performance_notes: String(form.performance_notes || "").trim(),
    };

    try {
      setBusy(true);
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employeeSalary/${encodeURIComponent(form.salary_id)}`,
        payload
      );
      toast.success("Salary record updated");
      setOpen(false);
      setEditId(null);
      resetForm();
      fetchSalaries();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update salary record";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  // -------- DELETE ----------
  async function deleteSalary(p) {
    const key = p.salary_id ?? p._id;
    if (!key) {
      toast.error("Missing id");
      return;
    }

    try {
      setBusy(true);
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employeeSalary/${encodeURIComponent(key)}`
      );
      toast.success("Salary record deleted");
      fetchSalaries();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete salary record";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  // -------- SEARCH ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const a = (v) => String(v ?? "").toLowerCase();
      return (
        a(p.salary_id).includes(q) ||
        a(p.base_salary).includes(q) ||
        a(p.pay_method).includes(q) ||
        a(p.pay_date).includes(q) ||
        a(p.overtime_payment).includes(q) ||
        a(p.workshift_schedule).includes(q) ||
        a(p.attendance_count).includes(q) ||
        a(p.leave_count).includes(q) ||
        a(p.performance_notes).includes(q)
      );
    });
  }, [query, items]);

  useEffect(() => {
    fetchSalaries();
  }, []);

  // Simple number formatter
  const money = (n) => {
    if (n === null || n === undefined || n === "") return "-";
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const inputCls =
    "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500";

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header / Actions */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Salaries</h1>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by any field…"
                className={`w-80 pl-9 pr-3 ${inputCls}`}
              />
            </div>

            {/* Add */}
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
              Add Salary
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header row: 13 columns total */}
            <div className="grid grid-cols-13 gap-x-8 gap-y-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-1">Salary ID</div>
              <div className="col-span-1 text-right">Base Salary</div>
              <div className="col-span-1">Pay Method</div>
              <div className="col-span-1">Pay Date</div>
              <div className="col-span-1 text-right">Overtime Payment</div>
              <div className="col-span-2">Workshift Schedule</div>
              <div className="col-span-1 text-right">Attendance Count</div>
              <div className="col-span-1 text-right">Leave Count</div>
              <div className="col-span-3">Performance Notes</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Body */}
            {busy ? (
              <div className="p-6 text-sm text-gray-500">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No salary data found
              </div>
            ) : (
              filtered.map((p) => {
                const key = p._id ?? p.salary_id;
                return (
                  <div
                    key={key}
                    className="grid grid-cols-13 gap-x-8 gap-y-4 px-6 py-3 text-sm text-gray-800 border-b last:border-none"
                  >
                    <div className="col-span-1 font-mono">
                      {p.salary_id ?? "-"}
                    </div>
                    <div className="col-span-1 text-right whitespace-nowrap">
                      {p.base_salary === 0 ? "0" : money(p.base_salary)}
                    </div>
                    <div className="col-span-1">{p.pay_method ?? "-"}</div>
                    <div className="col-span-1">
                      {p.pay_date ? String(p.pay_date).slice(0, 10) : "-"}
                    </div>
                    <div className="col-span-1 text-right whitespace-nowrap">
                      {p.overtime_payment === 0
                        ? "0"
                        : money(p.overtime_payment)}
                    </div>
                    <div className="col-span-2 truncate">
                      {p.workshift_schedule ?? "-"}
                    </div>
                    <div className="col-span-1 text-right">
                      {p.attendance_count ?? "-"}
                    </div>
                    <div className="col-span-1 text-right">
                      {p.leave_count ?? "-"}
                    </div>
                    <div className="col-span-3 truncate">
                      {p.performance_notes ?? "-"}
                    </div>
                    <div className="col-span-1">
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
                          onClick={() => deleteSalary(p)}
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

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editId ? "Update Salary" : "Add Salary"}
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

            {/* Two fields per row with rounded-xl inputs */}
            <form onSubmit={editId ? onUpdate : onCreate} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Salary ID *</span>
                  <input
                    name="salary_id"
                    value={form.salary_id}
                    onChange={handleChange}
                    required
                    disabled={!!editId}
                    className={`${inputCls} disabled:bg-gray-100`}
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Base Salary *</span>
                  <input
                    type="number"
                    name="base_salary"
                    value={form.base_salary}
                    onChange={handleChange}
                    placeholder="in LKR"
                    required
                    className={inputCls}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Pay Method *</span>
                  <input
                    name="pay_method"
                    value={form.pay_method}
                    onChange={handleChange}
                    placeholder="e.g. Bank Transfer / Cash"
                    required
                    className={inputCls}
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Pay Date *</span>
                  <input
                    type="date"
                    name="pay_date"
                    value={form.pay_date}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">
                    Overtime Payment
                  </span>
                  <input
                    type="number"
                    name="overtime_payment"
                    value={form.overtime_payment}
                    onChange={handleChange}
                    placeholder="in LKR"
                    className={inputCls}
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">
                    Attendance Count
                  </span>
                  <input
                    type="number"
                    name="attendance_count"
                    value={form.attendance_count}
                    onChange={handleChange}
                    placeholder="e.g. 22"
                    className={inputCls}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Leave Count</span>
                  <input
                    type="number"
                    name="leave_count"
                    value={form.leave_count}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    className={inputCls}
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">
                    Workshift Schedule
                  </span>
                  <input
                    name="workshift_schedule"
                    value={form.workshift_schedule}
                    onChange={handleChange}
                    placeholder="e.g. Mon–Fri 09:00–17:00"
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="text-sm block">
                <span className="mb-1 block font-medium">
                  Performance Notes
                </span>
                <textarea
                  name="performance_notes"
                  value={form.performance_notes}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputCls} resize-y`}
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
                  {editId ? "Update Salary" : "Save Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top progress bar */}
      <div
        className={`pointer-events-none fixed left-0 top-0 h-0.5 bg-red-600 transition-all ${
          busy ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}
