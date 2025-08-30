// components/PlanCard.jsx
/* eslint-disable react/prop-types */
export default function PlanCard({ plan }) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition
        ${
          plan.popular
            ? "border-red-600 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            : "border-black/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <header className="mb-4">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="mt-1 text-sm text-black/70">{plan.blurb}</p>
      </header>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">LKR{plan.price}</span>
          <span className="text-sm text-black/60">/mo</span>
        </div>
      </div>

      <ul className="mb-6 space-y-2 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16.667 5.833 7.5 15l-4.167-4.167"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => alert(`Selected: ${plan.name}`)}
        className={`mt-auto w-full rounded-xl border px-4 py-3 text-sm font-semibold transition
          ${
            plan.popular
              ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
              : "border-black/15 text-black hover:bg-red-600 hover:text-white hover:border-red-600"
          }`}
      >
        {plan.cta}
      </button>
    </article>
  );
}
