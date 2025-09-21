import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import bowl from "../../assets/healthy-meal.png"

function IconBowl() {
  return (
    <img
      src={bowl}
      className="icon h-5 w-5 inline-block object-contain"
    />
  );
}
function IconTimer() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M12 8v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 3h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconFire() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M12 3s-2 2-2 4a3 3 0 006 0c0-2-2-4-2-4 3 2 6 6 6 9a8 8 0 11-16 0c0-3 3-7 8-9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
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

function MealPlanCard({ plan }) {
  const name = plan.meal_name ?? plan.mealName ?? "-";
  const type = plan.meal_type ?? plan.planMealType ?? "-";
  const duration = plan.duration ?? "-";
  const calaries = plan.calaries ?? plan.calories ?? "-"; // backend uses "calaries"
  const description = plan.description ?? plan.planDescription ?? "-";

  const typeTone = String(type).toLowerCase() === "vegan" ? "green" : "green";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200">
          <IconBowl />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <Pill tone={typeTone}>{type}</Pill>
          </div>
          <p className="mt-1 text-sm text-gray-600 break-words">
            {description}
          </p>
        </div>

        {/* Delete button (UI only, no backend wiring) */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              /* TODO: hook up delete later */
            }}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            aria-label="Delete meal plan"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 px-5 py-3">
        <Pill>
          <span className="inline-flex items-center gap-1">
            <IconTimer /> <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-800">{duration}</span>
          </span>
        </Pill>
        <Pill>
          <span className="inline-flex items-center gap-1">
            <IconFire /> <span className="text-gray-600">Calaries:</span>
            <span className="font-medium text-gray-800">{calaries}</span>
          </span>
        </Pill>
      </div>
    </div>
  );
}

export default function CurrentMeal() {
  const [plans, setPlans] = useState([]);
  const [busy, setBusy] = useState(false);

  async function fetchPlans() {
    try {
      setBusy(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: "Bearer " + token } : undefined;

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/mealPlan/getOneMealPlan`,
        { headers }
      );

      const items = Array.isArray(data?.response)
        ? data.response
        : Array.isArray(data)
        ? data
        : [];
      setPlans(items);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load meal plans";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Meal Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here you can see your active meal plans.
          </p>
        </div>

        {/* Cards grid */}
        {busy && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-neutral-500">
            Loading…
          </div>
        )}

        {!busy && plans.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-neutral-500">
            No meal plans found
          </div>
        )}

        {!busy && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <MealPlanCard
                key={plan._id ?? plan.meal_name ?? Math.random()}
                plan={plan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
