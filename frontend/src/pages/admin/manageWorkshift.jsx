import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Salaries() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    salary_id: "",
    base_salary: "",
    salaryPay_method: "",
    salaryPay_date: "",
    overtime_pay: "",
    workshift_schedule: "",
    attendance_count: "",
    leave_count: "",
    performance_notes: "",
  });

  const resetForm = () =>
    setForm({
      salary_id: "",
      base_salary: "",
      salaryPay_method: "",
      salaryPay_date: "",
      overtime_pay: "",
      workshift_schedule: "",
      attendance_count: "",
      leave_count: "",
      performance_notes: "",
    });

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
    if (
      !form.salary_id ||
      !form.base_salary ||
      !form.salaryPay_method ||
      !form.salaryPay_date
    ) {
      toast.error(
        "Please fill Salary ID, Base Salary, Pay Method, and Pay Date."
      );
      return;
    }

    const payload = {
      salary_id: String(form.salary_id).trim(),
      base_salary: Number(form.base_salary),
      salaryPay_method: String(form.salaryPay_method || "").trim(),
      salaryPay_date: String(form.salaryPay_date || "").trim(),
      overtime_pay: form.overtime_pay === "" ? 0 : Number(form.overtime_pay),
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
      salary_id: p.salary_id ?? "",
      base_salary: p.base_salary ?? "",
      salaryPay_method: p.salaryPay_method ?? "",
      salaryPay_date: (p.salaryPay_date ?? "").slice(0, 10),
      overtime_pay: p.overtime_pay ?? "",
      workshift_schedule: p.workshift_schedule ?? "",
      attendance_count: p.attendance_count ?? "",
      leave_count: p.leave_count ?? "",
      performance_notes: p.performance_notes ?? "",
    });
    setOpen(true);
  }

  async function onUpdate(e) {
    e.preventDefault();
    if (!editId) {
      toast.error("Missing salary_id for update");
      return;
    }

    const payload = {
      salary_id: String(form.salary_id).trim(),
      base_salary: Number(form.base_salary),
      salaryPay_method: String(form.salaryPay_method || "").trim(),
      salaryPay_date: String(form.salaryPay_date || "").trim(),
      overtime_pay: form.overtime_pay === "" ? 0 : Number(form.overtime_pay),
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
    try {
      setBusy(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/employeeSalary/${key}`
      );
      toast.success("Salary record deleted");
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
          "Salary ID",
          "Base Salary",
          "Pay Method",
          "Pay Date",
          "Overtime",
          "Workshift",
          "Attendance",
          "Leave",
          "Performance Notes",
        ],
      ],
      body: items.map((p) => [
        p.salary_id ?? "-",
        p.base_salary ?? "-",
        p.salaryPay_method ?? "-",
        p.salaryPay_date ?? "-",
        p.overtime_pay ?? "-",
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
          <h1 className="text-2xl font-semibold text-black">Salaries</h1>
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

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">Salary ID</th>
                <th className="px-3 py-2 text-left">Base Salary</th>
                <th className="px-3 py-2 text-left">Pay Method</th>
                <th className="px-3 py-2 text-left">Pay Date</th>
                <th className="px-3 py-2 text-left">Overtime</th>
                <th className="px-3 py-2 text-left">Workshift</th>
                <th className="px-3 py-2 text-left">Attendance</th>
                <th className="px-3 py-2 text-left">Leave</th>
                <th className="px-3 py-2 text-left">Performance Notes</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-3 py-4 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!busy && items.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-3 py-4 text-center text-neutral-500"
                  >
                    No salary data found.
                  </td>
                </tr>
              )}
              {!busy &&
                items.map((p) => (
                  <tr
                    key={p._id ?? p.salary_id}
                    className="border-t border-black/10"
                  >
                    <td className="px-3 py-2 font-mono">
                      {p.salary_id ?? "-"}
                    </td>
                    <td className="px-3 py-2">{money(p.base_salary)}</td>
                    <td className="px-3 py-2">{p.salaryPay_method ?? "-"}</td>
                    <td className="px-3 py-2">
                      {p.salaryPay_date
                        ? String(p.salaryPay_date).slice(0, 10)
                        : "-"}
                    </td>
                    <td className="px-3 py-2">{money(p.overtime_pay)}</td>
                    <td className="px-3 py-2">{p.workshift_schedule ?? "-"}</td>
                    <td className="px-3 py-2">{p.attendance_count ?? "-"}</td>
                    <td className="px-3 py-2">{p.leave_count ?? "-"}</td>
                    <td className="px-3 py-2 max-w-[280px] truncate">
                      {p.performance_notes ?? "-"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md bg-[#e30613] px-2 py-1 text-white hover:opacity-90"
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
                <p className="text-xs text-gray-500">
                  Keep it short & accurate.
                </p>
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
            >
              {/* Two-column section */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Base Salary *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Gross monthly amount before extras.
                  </p>
                  <input
                    type="number"
                    name="base_salary"
                    placeholder="LKR"
                    value={form.base_salary}
                    onChange={(e) =>
                      setForm({ ...form, base_salary: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Pay Date *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Calendar date this salary is paid.
                  </p>
                  <input
                    type="date"
                    name="salaryPay_date"
                    value={form.salaryPay_date}
                    onChange={(e) =>
                      setForm({ ...form, salaryPay_date: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Pay Method *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    How the employee is paid (cash, bank transfer, etc.).
                  </p>
                  <input
                    name="salaryPay_method"
                    placeholder="Cash, Bank transfer…"
                    value={form.salaryPay_method}
                    onChange={(e) =>
                      setForm({ ...form, salaryPay_method: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Workshift Schedule
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Typical working hours or rotation.
                  </p>
                  <input
                    name="workshift_schedule"
                    placeholder="e.g. Mon–Fri 8:00–16:00"
                    value={form.workshift_schedule}
                    onChange={(e) =>
                      setForm({ ...form, workshift_schedule: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Overtime Payment
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Total overtime pay for this period.
                  </p>
                  <input
                    type="number"
                    name="overtime_pay"
                    placeholder="LKR"
                    value={form.overtime_pay}
                    onChange={(e) =>
                      setForm({ ...form, overtime_pay: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Attendance Count
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Number of days present in the period.
                  </p>
                  <input
                    type="number"
                    name="attendance_count"
                    min="0"
                    placeholder="0"
                    value={form.attendance_count}
                    onChange={(e) =>
                      setForm({ ...form, attendance_count: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>

                {/* ROW: Leave Count + Performance Notes */}
                <div className="flex flex-col">
                  <label className="block mb-1 text-sm font-medium text-black">
                    Performance Notes
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Any comments, adjustments, or remarks for this cycle.
                  </p>
                  <textarea
                    name="performance_notes"
                    placeholder="Description"
                    value={form.performance_notes}
                    onChange={(e) =>
                      setForm({ ...form, performance_notes: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 resize-y"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-black">
                    Leave Count
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Approved leave days in the period.
                  </p>
                  <input
                    type="number"
                    name="leave_count"
                    min="0"
                    placeholder="0"
                    value={form.leave_count}
                    onChange={(e) =>
                      setForm({ ...form, leave_count: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Footer */}
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
