import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:3000/api/challenge";

const fmt = (d) =>
  new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

const statusOf = (start, end) => {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (now < s) return { key: "upcoming", label: "Upcoming" };
  if (now > e) return { key: "ended", label: "Ended" };
  return { key: "ongoing", label: "Ongoing" };
};

export default function Competitions() {
  const [list, setList] = useState([]);
  const [joined, setJoined] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState({}); 

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const load = async () => {

    try {
      setLoading(true);
      const r1 = await fetch(`${API}/`, { headers: authHeader });

      if (!r1.ok) {
        throw new Error(`HTTP ${r1.status}`);
      }

      const challenges = await r1.json();
      setList(challenges);

      const r2 = await fetch(`${API}/joined`, { headers: authHeader });
      
      if (!r2.ok) {
        throw new Error(`HTTP ${r2.status}`);
      }
      
      const { joined } = await r2.json();
      setJoined(new Set(joined));
    } catch (e) {
      console.error("Load competitions failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  }, []);

  const join = async (challengeID) => {
    try {
      setJoining((j) => ({ ...j, [challengeID]: true }));
      const res = await fetch(`${API}/join/${challengeID}`, {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `HTTP ${res.status}`);
      }
      await res.json();
      setJoined((s) => new Set([...Array.from(s), challengeID]));
    } catch (e) {
      alert(e.message);
    } finally {
      setJoining((j) => ({ ...j, [challengeID]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-extrabold text-red-600">Competitions</h1>
          <p className="mt-1 text-gray-600">
            Join events, push your limits, and earn points.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-2xl font-bold text-red-600">No competitions yet</div>
            <div className="mt-2 text-gray-600">
              Check back soon for new challenges.
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((c) => {
              const st = statusOf(c.startDate, c.endDate);
              const isJoined = joined.has(c.challengeID);
              const disabled = isJoined || st.key === "ended";

              return (
                <article
                  key={c.challengeID}
                  className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                        (st.key === "ongoing"
                          ? "bg-red-100 text-red-700"
                          : st.key === "upcoming"
                          ? "bg-rose-50 text-red-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {st.label}
                    </span>
                    <span className="text-sm font-extrabold text-red-700">
                      {c.points} pts
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-extrabold text-gray-900">
                    {c.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-700">
                    {c.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-rose-50/50 p-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Starts
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {fmt(c.startDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-500">
                        Ends
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {fmt(c.endDate)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex-grow" />
                  <div className="flex items-center justify-end gap-2">
                    {isJoined ? (
                      <button
                        disabled
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600"
                      >
                        Joined
                      </button>
                    ) : (
                      <button
                        onClick={() => join(c.challengeID)}
                        disabled={disabled || joining[c.challengeID]}
                        className={
                          "inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition " +
                          (disabled
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : "bg-red-600 text-white hover:bg-red-700")
                        }
                        title={
                          st.key === "ended"
                            ? "This event has ended"
                            : "Join this competition"
                        }
                      >
                        {joining[c.challengeID] ? "Joining…" : "Join & earn points"}
                      </button>
                    )}
                  </div>

                  <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
