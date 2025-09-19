import React, { useEffect, useMemo, useState } from "react";
import { getAllTrainers, removeTrainer } from "../../../api/trainer";
import Loader from "../../../components/lorder-animate";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ViewTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState("");

  function fetchTrainers() {
    setLoaded(false);
    getAllTrainers()
      .then((data) => {
        setTrainers(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  useEffect(() => {
    fetchTrainers();
  }, []);

  async function doRemove(trainerId) {
    setRemoving(trainerId);
    try {
      await removeTrainer(trainerId);
      setTrainers((prev) => prev.filter((t) => t.trainerId !== trainerId));
      toast.success("Trainer removed");
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove trainer");
    } finally {
      setRemoving("");
    }
  }

  function confirmRemove(trainerId) {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-72">
        <p className="text-sm text-gray-800">
          Are you sure you want to remove this trainer?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              doRemove(trainerId);
            }}
            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    ));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return trainers;
    return trainers.filter((t) => {
      const fields = [
        t.trainerId,
        t.name,
        t.email,
        t.phoneNumber,
        t.specialization,
        Array.isArray(t.certifications) ? t.certifications.join(" ") : "",
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [search, trainers]);

  return (
    <div className="relative w-full h-full rounded-lg">
    
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Trainers</h2>

        <div className="flex items-center gap-3">
    
          <div className="relative w-64 sm:w-80">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by any field..."
              className="h-9 w-full rounded-full border border-black/10 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {search && (
              <button
                aria-label="Clear"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-full hover:bg-black/5 text-neutral-500"
              >
                ✕
              </button>
            )}
          </div>

          
          <Link
            to="/admin/trainers/register"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700 transition"
            title="Add Trainer"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Trainer
          </Link>
        </div>
      </div>

      {loaded ? (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Trainer ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Certifications</th>
                <th className="px-3 py-2 text-left">Experience</th>
                <th className="px-3 py-2 text-left">Specialization</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-neutral-500" colSpan={9}>
                    No trainers found.
                  </td>
                </tr>
              )}
              {filtered.map((trainer, idx) => (
                <tr key={trainer._id || trainer.trainerId || idx} className="border-t border-black/10">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{trainer.trainerId || "-"}</td>
                  <td className="px-3 py-2 font-medium">{trainer.name}</td>
                  <td className="px-3 py-2">{trainer.email}</td>
                  <td className="px-3 py-2">{trainer.phoneNumber || "-"}</td>
                  <td className="px-3 py-2">
                    {Array.isArray(trainer.certifications) && trainer.certifications.length
                      ? trainer.certifications.join(", ")
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{trainer.experienceYears ?? "-"}</td>
                  <td className="px-3 py-2">{trainer.specialization || "-"}</td>
                  <td className="px-3 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-60"
                      onClick={() => confirmRemove(trainer.trainerId)}
                      disabled={removing === trainer.trainerId}
                    >
                      {removing === trainer.trainerId ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
