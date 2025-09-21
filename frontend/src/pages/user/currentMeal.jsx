import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import bowl from "../../assets/healthy-meal.png";

function IconBowl() {
  return (
    <img src={bowl} className="icon h-5 w-5 inline-block object-contain" alt="bowl" />
  );
}
function IconTimer() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MealPlanCard({ plan }) {
  const name = plan.meal_name ?? plan.mealName ?? "-";
  const type = plan.meal_type ?? plan.planMealType ?? "-";
  const duration = plan.duration ?? "-";
  const calaries = plan.calaries ?? plan.calories ?? "-";
  const description = plan.description ?? plan.planDescription ?? "-";
  const typeTone = String(type).toLowerCase() === "vegan" ? "green" : "gray";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200">
          <IconBowl />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
            <Pill tone={typeTone}>{type}</Pill>
          </div>
          <p className="mt-1 text-sm text-gray-600 break-words">{description}</p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => {
              /* UI-only delete button (no backend) */
              // you can later call a delete handler here
            }}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            aria-label="Delete meal plan"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>

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

      const items = Array.isArray(data?.response) ? data.response : Array.isArray(data) ? data : [];
      setPlans(items);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load meal plans";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  
  
  



  useEffect(() => {
    fetchPlans();
  }, []);

  function handleDownloadPDF() {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(16);
      doc.setTextColor("#e30613");
      doc.text("Meal Plans", 40, 40);

      const tableData = plans.map((p) => {
        return [
          p.meal_name ?? p.mealName ?? "-",
          p.meal_type ?? p.planMealType ?? "-",
          p.duration ?? "-",
          String(p.calaries ?? p.calories ?? "-"),
          (p.description ?? p.planDescription ?? "-").replace(/\s+/g, " ").slice(0, 300),
        ];
      });

      autoTable(doc, {
        head: [["Meal Name", "Meal Type", "Duration", "Calories", "Description"]],
        body: tableData,
        startY: 60,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 80 },
          2: { cellWidth: 60 },
          3: { cellWidth: 60 },
          4: { cellWidth: 240 },
        },
        didDrawPage: (data) => {
          // optional footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          doc.setTextColor(150);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 40, doc.internal.pageSize.height - 30);
          doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 30);
        },
      });

      doc.save("meal_plans.pdf");
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header*/}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-black">Meal Plans</h1>
            <p className="mt-1 text-sm text-gray-500">Here you can see your active meal plans.</p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
            >
              Download PDF
            </button>
          </div>
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
              <MealPlanCard key={plan._id ?? plan.meal_name ?? Math.random()} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
