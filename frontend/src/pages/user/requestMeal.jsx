import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import add from "../../assets/plus.png";

/* Small inline icons (no extra libs) */
function IconUser() {
  return <img src={add} className="icon h-5 w-5 inline-block object-contain" />;
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M3.5 9.5h17M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Pill({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
    red: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function RequestCard({ row, onUpdate, onDelete }) {
  const id = row.request_id ?? "-";
  const started = row.request_date
    ? String(row.request_date).slice(0, 10)
    : "-";
  const fullName =
    [row.user_name, row.last_name].filter(Boolean).join(" ") || "-";
  const mealType = row.mealType ?? "-";
  const weight = row.weight ?? "-";
  const height = row.height ?? "-";
  const description = row.description || "-";

  const tone =
    String(mealType).toLowerCase() === "vegan"
      ? "green"
      : String(mealType).toLowerCase() === "non-vegan"
      ? "red"
      : "gray";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200">
          <IconUser />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              Meal Request #{id}
            </h3>
            <Pill tone={tone}>{mealType}</Pill>
          </div>
          <p className="mt-1 text-sm text-gray-600 break-words">
            — {fullName} —
          </p>
          <p className="mt-1 text-sm text-gray-600 break-words">
            {weight} kg · {height} cm
          </p>
          <p className="mt-1 text-sm text-gray-600 break-words">
            {description}
          </p>
        </div>

        {/* Actions (same wiring, just styled to match) */}
        <div className="shrink-0 flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate(row)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 px-5 py-3">
        <Pill>
          <span className="inline-flex items-center gap-1">
            <IconCalendar />
            <span className="text-gray-600">Requested:</span>
            <span className="font-medium text-gray-800">{started}</span>
          </span>
        </Pill>
        <Pill>
          <span className="inline-flex items-center gap-1">
            <span className="text-gray-600">W/H:</span>
            <span className="font-medium text-gray-800">
              {weight} kg / {height} cm
            </span>
          </span>
        </Pill>
      </div>
    </div>
  );
}

export default function RequestMeals() {
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [editForm, setEditForm] = useState({
    request_id: "",
    user_id: "",
    user_name: "",
    last_name: "",
    request_date: "",
    description: "",
    mealType: "Non-Vegan",
    weight: "",
    height: "",
  });

  async function fetchRequests() {
    const token = localStorage.getItem("token");
    try {
      setBusy(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealRequest/getOneMeal`,
        { headers: { Authorization: "Bearer " + token } }
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

  useEffect(() => {
    fetchRequests();
  }, []);

  const isValidDate = (str) => {
    if (!str) return false;
    const d = new Date(str);
    return !Number.isNaN(d.getTime());
  };
  const isPositive = (v) => Number.isFinite(Number(v)) && Number(v) > 0;

  const validate = (v) => {
    const e = {};
    if (!String(v.user_name || "").trim())
      e.user_name = "First name is required.";
    if (!String(v.last_name || "").trim())
      e.last_name = "Last name is required.";
    if (!String(v.request_date || "").trim())
      e.request_date = "Request date is required.";
    else if (!isValidDate(v.request_date)) e.request_date = "Invalid date.";
    if (!String(v.description || "").trim())
      e.description = "Description is required.";
    if (!String(v.mealType || "").trim()) e.mealType = "Meal type is required.";
    else if (!["Vegan", "Non-Vegan"].includes(v.mealType))
      e.mealType = "Choose Vegan or Non-Vegan.";
    if (!String(v.height).trim()) e.height = "Height is required.";
    else if (!isPositive(v.height))
      e.height = "Height must be a number greater than 0.";
    if (!String(v.weight).trim()) e.weight = "Weight is required.";
    else if (!isPositive(v.weight))
      e.weight = "Weight must be a number greater than 0.";
    return e;
  };

  const handleOpenUpdate = (row) => {
    setEditForm({
      request_id: row.request_id ?? "",
      user_id: row.user_id ?? "",
      user_name: row.user_name ?? "",
      last_name: row.last_name ?? "",
      request_date: row.request_date ?? "",
      description: row.description ?? "",
      mealType: row.mealType ?? "Non-Vegan",
      weight: row.weight ?? "",
      height: row.height ?? "",
    });
    setErrors({});
    setOpen(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.request_id) {
      toast.error("Missing request ID");
      return;
    }
    const v = validate(editForm);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    const payload = {
      user_id: editForm.user_id,
      user_name: editForm.user_name,
      last_name: editForm.last_name,
      request_date: editForm.request_date,
      description: editForm.description,
      mealType: editForm.mealType,
      weight: editForm.weight,
      height: editForm.height,
    };
    try {
      setSaving(true);
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/mealRequest/${encodeURIComponent(editForm.request_id)}`,
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
      fetchRequests();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update request";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  async function handleDelete(row) {
    if (!row.request_id) {
      toast.error("Missing request ID");
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
      setSaving(true);
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/mealRequest/${encodeURIComponent(row.request_id)}`
      );
      await Swal.fire({
        title: "Deleted!",
        text: "The record has been deleted.",
        icon: "success",
      });
      fetchRequests();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to delete request";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const label = "block mb-1 text-sm font-medium text-black";
  const sub = "text-xs text-gray-500 mb-2";
  const input =
    "w-full border border-black/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2";

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-black">
            Manage Your Meal Requests
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {busy && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-neutral-500 col-span-full">
              Loading…
            </div>
          )}

          {!busy && requests.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-neutral-500 col-span-full">
              No requests found
            </div>
          )}

          {!busy &&
            requests.map((r) => (
              <RequestCard
                key={r._id ?? r.request_id}
                row={r}
                onUpdate={handleOpenUpdate}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </div>

      {/* Form */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-3">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl mt-13">
            <div className="flex items-center justify-between rounded-t-xl border-b px-4 py-3">
              <h2 className="text-base font-semibold text-black">
                Update Meal Request
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitUpdate}
              className="space-y-4 p-4"
              noValidate
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>First Name</label>
                  <p className={sub}>Your first name.</p>
                  <input
                    type="text"
                    value={editForm.user_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, user_name: e.target.value })
                    }
                    className={`${input} ${
                      errors.user_name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.user_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.user_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className={label}>Last Name</label>
                  <p className={sub}>Your family surname.</p>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    className={`${input} ${
                      errors.last_name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className={label}>Request Date</label>
                  <p className={sub}>Date you added the request.</p>
                  <input
                    type="date"
                    value={
                      editForm.request_date
                        ? String(editForm.request_date).slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({ ...editForm, request_date: e.target.value })
                    }
                    className={`${input} ${
                      errors.request_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.request_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.request_date}
                    </p>
                  )}
                </div>
                <div>
                  <label className={label}>Height</label>
                  <p className={sub}>Your height in centimeters (cm).</p>
                  <input
                    type="text"
                    value={editForm.height}
                    onChange={(e) =>
                      setEditForm({ ...editForm, height: e.target.value })
                    }
                    className={`${input} ${
                      errors.height ? "border-red-500" : ""
                    }`}
                  />
                  {errors.height && (
                    <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                  )}
                </div>
                <div>
                  <label className={label}>Weight</label>
                  <p className={sub}>Your weight in kilograms (kg).</p>
                  <input
                    type="text"
                    value={editForm.weight}
                    onChange={(e) =>
                      setEditForm({ ...editForm, weight: e.target.value })
                    }
                    className={`${input} ${
                      errors.weight ? "border-red-500" : ""
                    }`}
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={label}>Description</label>
                <p className={sub}>Add any notes or special requirements.</p>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className={`${input} ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className={label}>Meal Type</label>
                <p className={sub}>Choose the type of meal preference.</p>
                <div className="mt-1 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mealType"
                      value="Vegan"
                      checked={editForm.mealType === "Vegan"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mealType: e.target.value })
                      }
                    />
                    Vegan
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mealType"
                      value="Non-Vegan"
                      checked={editForm.mealType === "Non-Vegan"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mealType: e.target.value })
                      }
                    />
                    Non-Vegan
                  </label>
                </div>
                {errors.mealType && (
                  <p className="mt-1 text-sm text-red-600">{errors.mealType}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
