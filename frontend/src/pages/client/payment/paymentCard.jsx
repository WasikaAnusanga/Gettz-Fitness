import { useLocation, useNavigate ,Link} from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const plan = state?.plan ?? "Premium Plus Monthly";
  const price = state?.price ?? "LKR 4500 /mo";
  const features=state?.features 
  const handlePay = (e) => {
    e.preventDefault();
    alert(`Payment successful for ${plan} (${price})`);
    navigate("/membership");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2">
        {/* Left: Payment form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Checkout</h1>
              <p className="mt-1 text-sm text-gray-500">
                You’re subscribing to <span className="font-medium">{plan}</span>
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-right">
              <div className="text-xs text-gray-500">Price LKR</div>
              <div className="text-lg font-semibold">{price}</div>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name on card</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Wasika Anusanga"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Card number</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">CVV</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={() => setSaveCard(!saveCard)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                Save this card for next time
              </label>

              <div className="flex gap-3">
                <Link to="/savedCards"><button 
                  type="button"
                  className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  View saved cards
                </button></Link>
                <button
                  type="submit"
                  className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Pay LKR. {price}
                </button>
              </div>
            </div>
          </form>

          <p className="mt-6 text-xs text-gray-500">
            By confirming your payment, you agree to the Gettz Fitness Terms of Service and recurring billing.
          </p>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700">Gettz Fitness</h3>
            <div className="mt-6 text-2xl font-mono tracking-widest text-gray-800">
              •••• •••• •••• ••••
            </div>
            <div className="mt-6 flex justify-between text-sm text-gray-600">
              <div>
                <div className="text-xs text-gray-500">Card Holder</div>
                <div>{nameOnCard || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Expiry</div>
                <div>{expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800">What you get</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
             {features.map((f) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
