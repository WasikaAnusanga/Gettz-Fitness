import React from "react";

export default function Dashboard({
  userName = "Great!",
  product = "Premium Membership",
  amount = "LKR 12,500.00",
  txnId = "TXN-9F2A7C",
  date = new Date().toLocaleDateString(),
}) {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col">
      {/* Main two-panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        {/* LEFT: Copy + illustration */}
        <section className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
          <p className="font-semibold text-emerald-600">Payment Successful</p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">
            {userName} Add funds now and secure your{" "}
            <span className="text-red-600">membership benefits</span>.
          </h1>

          <p className="mt-5 max-w-xl text-slate-600">
            To confirm this is really you, we may ask for a few quick details in
            the next 14 days—otherwise your account could be limited. You’re all
            set for now. Proceed to your dashboard to see what’s unlocked and
            what’s next.
          </p>

          {/* Receipt-ish details */}
          <div className="mt-8 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Product</span>
              <span className="font-medium text-slate-800">{product}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold text-slate-900">{amount}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-medium">{txnId}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="font-medium">{date}</span>
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href="/dashboard"
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-500"
              >
                Go to Dashboard
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                Download receipt
              </button>
            </div>
          </div>

        
        </section>

        {/* RIGHT: Spotlight podium + side card */}
        <aside className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
          {/* Spotlight wedge */}
          <div className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-[520px] w-[560px] max-w-[92%] rotate-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.85),_rgba(148,163,184,0.15)_60%,_transparent_70%)]" />

          {/* Coin + podium */}
          <div className="flex h-full items-center justify-center pt-16 pb-28">
            <div className="relative">
              {/* Coin */}
              <div className="mx-auto h-40 w-40 rounded-full bg-gradient-to-b from-amber-300 to-orange-400 shadow-xl ring-8 ring-white/70 flex items-center justify-center">
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,.15)]"
                  fill="currentColor"
                >
                  <path d="M9.55 17.54 4.4 12.4l1.41-1.41 3.74 3.74 8.65-8.65 1.41 1.41-10.06 10.05z" />
                </svg>
              </div>

              {/* Twinkling stars */}
              <Star className="left-[-22px] top-[18px]" />
              <Star className="right-[-22px] top-[30px]" />
              <Star className="left-[-18px] bottom-[40px]" />
              <Star className="right-[-20px] bottom-[28px]" />

              {/* Podium */}
              <div className="mt-6 mx-auto h-5 w-56 rounded-full bg-slate-300/60" />
              <div className="mx-auto h-8 w-64 rounded-lg bg-indigo-600/90" />
              <div className="mx-auto h-6 w-80 rounded-b-2xl bg-indigo-700/95" />
            </div>
          </div>

          {/* Right panel title */}
          <div className="absolute top-8 right-0 left-0 text-center px-6">
            <p className="text-sm text-slate-500">Unlocked perks</p>
            <h3 className="text-xl font-bold">Free training sessions</h3>
          </div>
        </aside>
      </div>

    </div>
  );
}

/* ---------- Small UI bits ---------- */

function Star({ className = "" }) {
  return (
    <span
      className={`absolute block h-3 w-3 rotate-45 bg-slate-200 shadow-sm ${className}`}
    />
  );
}

function CardIllustration() {
  // Minimal friendly SVG depicting a person with a giant card + check
  return (
    <svg
      viewBox="0 0 560 280"
      className="w-full max-w-[520px] drop-shadow-sm"
      role="img"
      aria-label="Payment confirmation illustration"
    >
      <defs>
        <linearGradient id="grad1" x1="0" x2="1">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Screen with check */}
      <rect x="46" y="26" rx="14" width="158" height="110" fill="#e2e8f0" />
      <circle cx="74" cy="58" r="16" fill="#10b981" />
      <path
        d="M66 58l6 6 10-12"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="70" y="84" width="110" height="10" rx="5" fill="#cbd5e1" />
      <rect x="70" y="100" width="84" height="10" rx="5" fill="#cbd5e1" />

      {/* Character */}
      <circle cx="250" cy="120" r="18" fill="#fde68a" />
      <rect x="240" y="136" width="20" height="12" rx="6" fill="#fde68a" />
      <rect x="222" y="148" width="56" height="76" rx="10" fill="url(#grad1)" />
      <rect x="206" y="224" width="28" height="10" rx="5" fill="#0ea5e9" />
      <rect x="262" y="224" width="28" height="10" rx="5" fill="#0ea5e9" />

      {/* Big card */}
      <rect x="292" y="70" width="210" height="130" rx="14" fill="#94a3b8" />
      <rect x="308" y="88" width="56" height="36" rx="6" fill="#e2e8f0" />
      <rect x="308" y="138" width="164" height="14" rx="7" fill="#e2e8f0" />
      <rect x="308" y="158" width="136" height="12" rx="6" fill="#e2e8f0" />
      <circle cx="472" cy="98" r="10" fill="#ef4444" />
      <path
        d="M468 98l3 3 6-7"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
