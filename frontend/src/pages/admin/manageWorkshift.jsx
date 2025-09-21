import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export default function Salaries() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    base_salary: "",
    salaryPay_method: "",
    salaryPay_date: "",
    employee_role: "",
    workshift_schedule: "",
    attendance_count: "",
    leave_count: "",
    performance_notes: "",
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setForm({
      base_salary: "",
      salaryPay_method: "",
      salaryPay_date: "",
      employee_role: "",
      workshift_schedule: "",
      attendance_count: "",
      leave_count: "",
      performance_notes: "",
    });
    setErrors({});
  };

  const isValidDate = (str) => {
    if (!str) return false;
    const d = new Date(str);
    return !Number.isNaN(d.getTime());
  };

  function validate(values) {
    const e = {};

    if (values.base_salary === "" || Number(values.base_salary) <= 0) {
      e.base_salary = "Base salary must be greater than 0.";
    }

    if (!String(values.salaryPay_method || "").trim()) {
      e.salaryPay_method = "Pay method is required.";
    }

    if (!String(values.salaryPay_date || "").trim()) {
      e.salaryPay_date = "Pay date is required.";
    } else if (!isValidDate(values.salaryPay_date)) {
      e.salaryPay_date = "Pay date is invalid.";
    }

    if (!String(values.employee_role || "").trim()) {
      e.employee_role = "Employee role is required.";
    }

    if (!String(values.workshift_schedule || "").trim()) {
      e.workshift_schedule = "Workshift schedule is required.";
    }

    if (values.attendance_count === "") {
      e.attendance_count = "Attendance count is required (use 0 if none).";
    } else if (
      !Number.isFinite(Number(values.attendance_count)) ||
      Number(values.attendance_count) < 0
    ) {
      e.attendance_count = "Attendance must be 0 or more.";
    }

    if (values.leave_count === "") {
      e.leave_count = "Leave count is required (use 0 if none).";
    } else if (
      !Number.isFinite(Number(values.leave_count)) ||
      Number(values.leave_count) < 0
    ) {
      e.leave_count = "Leave must be 0 or more.";
    }

    return e;
  }

  async function fetchSalaries() {
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employeeSalary`
      );
      const list = Array.isArray(data?.response) ? data.response : [];
      setItems(list);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load salaries"
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchSalaries();
  }, []);

  async function onCreate(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      base_salary: Number(form.base_salary),
      salaryPay_method: String(form.salaryPay_method || "").trim(),
      salaryPay_date: String(form.salaryPay_date || "").trim(),
      employee_role: String(form.employee_role),
      workshift_schedule: String(form.workshift_schedule || "").trim(),
      attendance_count: Number(form.attendance_count),
      leave_count: Number(form.leave_count),
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
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message
      );
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p) {
    setEditId(p.salary_id);
    setForm({
      base_salary: p.base_salary ?? "",
      salaryPay_method: p.salaryPay_method ?? "",
      salaryPay_date: (p.salaryPay_date ?? "").slice(0, 10),
      employee_role: p.employee_role ?? "",
      workshift_schedule: p.workshift_schedule ?? "",
      attendance_count: p.attendance_count ?? "",
      leave_count: p.leave_count ?? "",
      performance_notes: p.performance_notes ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  async function onUpdate(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (!editId) {
      toast.error("Missing salary_id for update");
      return;
    }

    const payload = {
      base_salary: Number(form.base_salary),
      salaryPay_method: String(form.salaryPay_method || "").trim(),
      salaryPay_date: String(form.salaryPay_date || "").trim(),
      employee_role: String(form.employee_role),
      workshift_schedule: String(form.workshift_schedule || "").trim(),
      attendance_count: Number(form.attendance_count),
      leave_count: Number(form.leave_count),
      performance_notes: String(form.performance_notes || "").trim(),
    };

    try {
      setBusy(true);
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/employeeSalary/${encodeURIComponent(editId)}`,
        payload
      );
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your request has been updated",
        showConfirmButton: false,
        timer: 1500,
      });
      setOpen(false);
      setEditId(null);
      resetForm();
      fetchSalaries();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteSalary(p) {
    const key = p.salary_id;
    if (!key && key !== 0) {
      toast.error("Missing salary_id");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setBusy(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/employeeSalary/${key}`
      );
      await Swal.fire({
        title: "Deleted!",
        text: "Salary record has been deleted.",
        icon: "success",
      });

      fetchSalaries();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message
      );
    } finally {
      setBusy(false);
    }
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor("#e30613");
    doc.text("Employee Salaries Report", 14, 16);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Base Salary",
          "Pay Method",
          "Pay Date",
          "Employee Role",
          "Workshift",
          "Attendance",
          "Leave",
          "Performance Notes",
        ],
      ],
      body: items.map((p) => [
        p.base_salary ?? "-",
        p.salaryPay_method ?? "-",
        p.salaryPay_date ?? "-",
        p.employee_role ?? "-",
        p.workshift_schedule ?? "-",
        p.attendance_count ?? "-",
        p.leave_count ?? "-",
        p.performance_notes ?? "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
    });

    doc.save("employee_salaries.pdf");
  };

  const money = (n) => {
    if (n === null || n === undefined || n === "") return "-";
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Manage Employee Details</h1>
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
              Add Salary
            </button>
          </div>
        </div>

        {/* table (styled like membershipPlan.jsx) */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="w-20 px-4 py-3">Salary ID</th>
                <th className="w-28 px-4 py-3">Base Salary</th>
                <th className="w-40 px-4 py-3">Pay Method</th>
                <th className="w-28 px-4 py-3">Pay Date</th>
                <th className="w-40 px-4 py-3">Employee Role</th>
                <th className="w-40 px-4 py-3">Workshift</th>
                <th className="w-28 px-4 py-3">Attendance</th>
                <th className="w-28 px-4 py-3">Leave</th>
                <th className="w-[230px] px-4 py-3 text-left">
                  Performance Notes
                </th>
                <th className="w-32 px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-500">
              {busy && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && items.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-3 text-center text-neutral-500"
                  >
                    No salary data found.
                  </td>
                </tr>
              )}

              {!busy &&
                items.map((p) => (
                  <tr key={p._id ?? p.salary_id} className="align-top">
                    <td className="w-20 px-4 py-3 font-mono">
                      {p.salary_id ?? "-"}
                    </td>
                    <td className="w-28 px-4 py-3">{money(p.base_salary)}</td>
                    <td className="w-40 px-4 py-3">
                      {p.salaryPay_method ?? "-"}
                    </td>
                    <td className="w-28 px-4 py-3">
                      {p.salaryPay_date
                        ? String(p.salaryPay_date).slice(0, 10)
                        : "-"}
                    </td>
                    <td className="w-40 px-4 py-3">{p.employee_role ?? "-"}</td>
                    <td className="w-40 px-4 py-3">
                      {p.workshift_schedule ?? "-"}
                    </td>
                    <td className="w-28 px-4 py-3">
                      {p.attendance_count ?? "-"}
                    </td>
                    <td className="w-28 px-4 py-3">{p.leave_count ?? "-"}</td>
                    <td className="w-[230px] px-4 py-3 whitespace-pre-line break-words">
                      {p.performance_notes ?? "-"}
                    </td>
                    <td className="w-32 px-4 py-3">
                      <div className="flex justify-evenly">
                        <button
                          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 mr-[5px]"
                          onClick={() => startEdit(p)}
                        >
                          Update
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => deleteSalary(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-xl border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-black">
                  {editId ? "Update Salary" : "Add Salary"}
                </h2>
              </div>
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
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Base Salary
                  </label>
                  <input
                    type="number"
                    name="base_salary"
                    placeholder="LKR"
                    value={form.base_salary}
                    onChange={(e) =>
                      setForm({ ...form, base_salary: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.base_salary ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.base_salary && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.base_salary}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Pay Date
                  </label>

                  <input
                    type="date"
                    name="salaryPay_date"
                    value={form.salaryPay_date}
                    onChange={(e) =>
                      setForm({ ...form, salaryPay_date: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.salaryPay_date
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.salaryPay_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.salaryPay_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Pay Method
                  </label>

                  <input
                    name="salaryPay_method"
                    placeholder="Cash, Bank transfer…"
                    value={form.salaryPay_method}
                    onChange={(e) =>
                      setForm({ ...form, salaryPay_method: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.salaryPay_method
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.salaryPay_method && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.salaryPay_method}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Employee Role
                  </label>
                  <select
                    name="employee_role"
                    value={form.employee_role}
                    onChange={(e) =>
                      setForm({ ...form, employee_role: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.employee_role
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">— Select a role —</option>
                    <option value="Admin">Admin</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Equipment Manager">Equipment Manager</option>
                  </select>
                  {errors.employee_role && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.employee_role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Workshift Schedule
                  </label>
                  <input
                    name="workshift_schedule"
                    placeholder="e.g. Mon–Fri 8:00–16:00"
                    value={form.workshift_schedule}
                    onChange={(e) =>
                      setForm({ ...form, workshift_schedule: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.workshift_schedule
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.workshift_schedule && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.workshift_schedule}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Attendance Count
                  </label>

                  <input
                    type="number"
                    name="attendance_count"
                    placeholder="0"
                    value={form.attendance_count}
                    onChange={(e) =>
                      setForm({ ...form, attendance_count: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.attendance_count
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.attendance_count && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.attendance_count}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Leave Count
                  </label>

                  <input
                    type="number"
                    name="leave_count"
                    placeholder="0"
                    value={form.leave_count}
                    onChange={(e) =>
                      setForm({ ...form, leave_count: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 ${
                      errors.leave_count ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.leave_count && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.leave_count}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-black">
                    Performance Notes (optional)
                  </label>
                  <textarea
                    name="performance_notes"
                    placeholder="Description"
                    value={form.performance_notes}
                    onChange={(e) =>
                      setForm({ ...form, performance_notes: e.target.value })
                    }
                    rows={4}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-red-500 resize-y ${
                      errors.performance_notes
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.performance_notes && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.performance_notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
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
                  {editId ? "Update Salary" : "Save Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
