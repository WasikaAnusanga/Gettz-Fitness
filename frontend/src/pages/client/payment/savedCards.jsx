import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** ---- Tiny helpers ---- */
const last4 = (num) => num.slice(-4);
const mask = (num) => `•••• •••• •••• ${last4(num)}`;
const brandFrom = (n) => {
  const num = n.replace(/\s/g, "");
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  if (/^6(?:011|5)/.test(num)) return "Discover";
  return "Card";
};
const fmtNum = (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

/** ---- Saved Cards Page ---- */
export default function ViewSavedCards() {
  const navigate = useNavigate();

  // Demo data; replace with API on mount
  const [cards, setCards] = useState([
    { id: "1", name: "Wasika A.", number: "4242424242424242", exp: "11/27", isDefault: true },
    { id: "2", name: "Wasika A.", number: "5555555555554444", exp: "06/26", isDefault: false },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, else card object

  useEffect(() => {
    // TODO: fetch cards from backend and setCards(...)
  }, []);

  const onDelete = (id) => {
    // TODO: await api.delete(`/api/cards/${id}`)
    setCards((s) => s.filter((c) => c.id !== id));
  };

  const onSetDefault = (id) => {
    // TODO: await api.post(`/api/cards/${id}/default`)
    setCards((s) => s.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const openAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const openEdit = (card) => {
    setEditing(card);
    setOpenModal(true);
  };

  const handleSave = (cardPayload) => {
    if (editing) {
      // Update
      setCards((s) => s.map((c) => (c.id === editing.id ? { ...c, ...cardPayload } : c)));
    } else {
      // Create
      const newCard = { id: crypto.randomUUID(), isDefault: !cards.length, ...cardPayload };
      setCards((s) => [newCard, ...s.map((c) => ({ ...c, isDefault: false }))]); // make first card default
    }
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Saved cards</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your payment methods used for Gettz Fitness.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ← Back
            </button>
            <button
              onClick={openAdd}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Add new card
            </button>
          </div>
        </div>

        {/* Card list */}
        <div className="space-y-3">
          {cards.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
                  {brandFrom(c.number).slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {brandFrom(c.number)} • {mask(c.number)}
                    </p>
                    {c.isDefault && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {c.name} — Expires {c.exp}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!c.isDefault && (
                  <button
                    onClick={() => onSetDefault(c.id)}
                    className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => openEdit(c)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!cards.length && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
              No saved cards yet. Click <span className="font-medium">Add new card</span> to get started.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <EditCardForm
            initial={editing}
            onCancel={() => setOpenModal(false)}
            onSave={handleSave}
          />
        </Modal>
      )}
    </div>
  );
}

/** ---- Modal Shell ---- */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** ---- Add/Edit Card Form (inside modal) ---- */
function EditCardForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [number, setNumber] = useState(initial ? fmtNum(initial.number) : "");
  const [exp, setExp] = useState(initial?.exp ?? "");
  const [setDefault, setSetDefault] = useState(initial ? initial.isDefault : false);

  const title = initial ? "Update card" : "Add new card";

  const onSubmit = (e) => {
    e.preventDefault();
    const cleanNum = number.replace(/\s/g, "");
    if (cleanNum.length < 15) return alert("Enter a valid card number");
    if (!/^\d{2}\/\d{2}$/.test(exp)) return alert("Enter expiry as MM/YY");
    onSave({ name, number: cleanNum, exp, isDefault: setDefault });
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name on card</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wasika Anusanga"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Card number</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono tracking-widest focus:border-red-500 focus:ring-1 focus:ring-red-500"
            value={number}
            onChange={(e) => setNumber(fmtNum(e.target.value))}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={exp}
              onChange={(e) =>
                setExp(e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/"))
              }
              placeholder="MM/YY"
              inputMode="numeric"
              required
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                checked={setDefault}
                onChange={() => setSetDefault((s) => !s)}
              />
              Set as default
            </label>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Save card
          </button>
        </div>
      </form>
    </div>
  );
}
