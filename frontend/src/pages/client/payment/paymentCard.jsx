import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ⭐ added earlier: errors state
  const [errors, setErrors] = useState({});

  const plan = state.plan.plan_name;
  const price = state.plan.price;
  const features = state.plan.features;

  useEffect(() => {
    if (!loaded) {
      setCardNumber(state.cards?.card_number ?? "");
      setNameOnCard(state.cards?.card_name ?? "");
      setExpiry(state.cards?.expiry_date ?? "");
      setLoaded(true);
    }
  }, [loaded, state.cards]);

  // ⭐ updated: stronger validation + expiry rule (MM 01–12, YY > current yy)
  function validateForm() {
    const newErrors = {};
    const now = new Date();
    const currentYY = now.getFullYear() % 100; // last 2 digits

    const name = String(nameOnCard || "").trim();
    const numberDigits = String(cardNumber || "").replace(/\s/g, "");
    const exp = String(expiry || "").trim();
    const cvvDigits = String(cvv || "").trim();

    // presence checks since we removed required from inputs
    if (!name) newErrors.nameOnCard = "Name on card is required";
    if (!numberDigits) newErrors.cardNumber = "Card number is required";
    if (!exp) newErrors.expiry = "Expiry is required";
    if (!cvvDigits) newErrors.cvv = "CVV is required";

    if (name && !/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.nameOnCard = "Enter a valid name (letters only)";
    }

    if (numberDigits && !/^\d{16}$/.test(numberDigits)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Expiry checks
    if (exp) {
      // must be MM/YY with valid ranges
      const mmYyMatch = /^(\d{2})\/(\d{2})$/.test(exp);
      if (!mmYyMatch) {
        newErrors.expiry = "Enter expiry as MM/YY";
      } else {
        const [MM, YY] = exp.split("/");
        const mm = parseInt(MM, 10);
        const yy = parseInt(YY, 10);

        if (mm < 1 || mm > 12) {
          newErrors.expiry = "Month must be between 01 and 12";
        } else if (yy < currentYY) {
          // strictly greater than current year (as you asked)
          newErrors.expiry = `Year must be greater than ${String(currentYY).padStart(2, "0")}`;
        }
      }
    }

    if (cvvDigits && !/^\d{3}$/.test(cvvDigits)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function choosePlan(e) {
    e.preventDefault();

    // ⭐ unchanged: call validation before proceeding
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const cardBody = {
      card_number: cardNumber,
      card_name: nameOnCard,
      expiry_date: expiry,
    };

    try {
      if (saveCard) {
        await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/card/add",
          cardBody,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      }

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL +
          "/api/pay/createPayment/" +
          state.plan.plan_id,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const session = res.data; // { id: "cs_..." }
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) console.error("Stripe redirect error:", error.message);
    } catch (err) {
      toast.error("You already have a plan");
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 ">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 pt-8 flex justify-content items-center ">
        <button
          onClick={() => navigate("/membership")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold ml-[40px]">Checkout</h1>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2">
        {/* Left: Payment form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Add Card Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                You’re subscribing to{" "}
                <span className="font-medium">{plan}</span>
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 px-4 py-2 text-right">
              <div className="text-xs text-gray-500">Price LKR</div>
              <div className="text-lg font-semibold">{price}</div>
            </div>
          </div>

          <form onSubmit={choosePlan} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name on card
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Wasika Anusanga"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                // ⭐ updated: removed required
              />
              {/* ⭐ error message */}
              {errors.nameOnCard && (
                <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Card number
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                maxLength={16}
                // ⭐ updated: removed required
                inputMode="numeric"
              />
              {/* ⭐ error message */}
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expiry (MM/YY)
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  // ⭐ updated: removed required
                  inputMode="numeric"
                />
                {/* ⭐ error message */}
                {errors.expiry && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={3}
                  // ⭐ updated: removed required
                  inputMode="numeric"
                />
                {/* ⭐ error message */}
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* rest of your form unchanged ... */}
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
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => {
                    navigate("/membership/savedCards", {
                      state: state,
                    });
                  }}
                >
                  View saved cards
                </button>

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
            By confirming your payment, you agree to the Gettz Fitness Terms of
            Service and billing.
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
            <h3 className="text-base font-semibold text-gray-800">
              What you get
            </h3>
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
