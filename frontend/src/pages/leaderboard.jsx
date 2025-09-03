import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api/leaderboard";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLeaders(data);
      } catch (e) {
        console.error("Failed to load leaderboard:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center">
          <h1 className="text-3xl font-extrabold text-red-600">Leaderboard</h1>
          <p className="mt-1 text-gray-600">
            Track the top performers and climb your way up!
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-600">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                            Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                            Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                            Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-white">
                            Points
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {leaders.map((row, idx) => (
                        <tr
                            key={row._id}
                            className={
                            idx < 3
                                ? "bg-rose-50 font-semibold"
                                : "hover:bg-gray-50 transition"
                            }
                        >
                            <td className="px-6 py-4 text-sm text-gray-800">
                            #{idx + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                            {row.user_id?.firstName} {row.user_id?.lastName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(row.user_id?.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                            {row.user_id?.point}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>
    </div>
  );
}
