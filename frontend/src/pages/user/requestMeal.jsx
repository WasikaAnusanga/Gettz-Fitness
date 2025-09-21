import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RequestMeals() {
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
    birthday: "",
  });

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

  useEffect(() => {
    fetchRequests();
  }, []);

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
      birthday: row.birthday ?? "",
    });
    setOpen(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.request_id) {
      toast.error("Missing request ID");
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
      birthday: editForm.birthday,
    };
    try {
      setSaving(true);
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/mealRequest/${encodeURIComponent(editForm.request_id)}`,
        payload
      );
      toast.success("Request updated");
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
    try {
      setSaving(true);
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/mealRequest/${encodeURIComponent(row.request_id)}`
      );
      toast.success("Request deleted");
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
  const headerCell = "px-3 py-2 text-left";
  const cell = "px-3 py-2";

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-black">User Requests</h1>
        </div>

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className={headerCell}>Request ID</th>
                <th className={headerCell}>User ID</th>
                <th className={headerCell}>First Name</th>
                <th className={headerCell}>Last Name</th>
                <th className={headerCell}>Requested Date</th>
                <th className={headerCell}>Meal Type</th>
                <th className={headerCell}>Weight</th>
                <th className={headerCell}>Height</th>
                <th className={headerCell}>Birthday</th>
                <th className={headerCell}>Description</th>

                <th className={headerCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && (
                <tr>
                  <td className={cell} colSpan={11}>
                    Loading…
                  </td>
                </tr>
              )}

              {!busy && requests.length === 0 && (
                <tr>
                  <td className={cell} colSpan={11}>
                    No requests found
                  </td>
                </tr>
              )}

              {!busy &&
                requests.map((r) => {
                  const key = r._id ?? r.request_id;
                  return (
                    <tr key={key} className="border-t border-black/10">
                      <td className={`${cell} font-mono`}>
                        {String(r.request_id ?? "-")}
                      </td>
                      <td className={cell}>{r.user_id ?? "-"}</td>
                      <td className={cell}>{r.user_name ?? "-"}</td>
                      <td className={cell}>{r.last_name ?? "-"}</td>
                      <td className={cell}>
                        {r.request_date
                          ? String(r.request_date).slice(0, 10)
                          : "-"}
                      </td>

                      <td className={cell}>{r.mealType ?? "-"}</td>
                      <td className={cell}>{r.weight ?? "-"}</td>
                      <td className={cell}>{r.height ?? "-"}</td>
                      <td className={cell}>{r.birthday ?? "-"}</td>
                      <td className={cell}>{r.description ?? "-"}</td>
                      <td className={cell}>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenUpdate(r)}
                            className="rounded-md bg-black px-3 py-1 text-xs font-medium text-white"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(r)}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-3">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
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

            <form onSubmit={handleSubmitUpdate} className="space-y-4 p-4">
              <div>
                <label className={label}>First Name</label>
                <p className={sub}>Your first name.</p>
                <input
                  type="text"
                  value={editForm.user_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, user_name: e.target.value })
                  }
                  className={input}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Last Name</label>
                  <p className={sub}>Your family surname.</p>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Request Date</label>
                  <p className={sub}>
                    When you want this request to be recorded.
                  </p>
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
                    className={input}
                  />
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
                  className={input}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Height</label>
                  <p className={sub}>Your height in centimeters (cm).</p>
                  <input
                    type="text"
                    value={editForm.height}
                    onChange={(e) =>
                      setEditForm({ ...editForm, height: e.target.value })
                    }
                    className={input}
                  />
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
                    className={input}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Birth Day</label>
                  <p className={sub}>Your date of birth.</p>
                  <input
                    type="date"
                    value={
                      editForm.birthday
                        ? String(editForm.birthday).slice(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthday: e.target.value })
                    }
                    className={input}
                  />
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
                </div>
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
