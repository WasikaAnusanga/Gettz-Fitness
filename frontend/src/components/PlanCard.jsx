import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PlanCard(props) {
  const plan=props.plan
  
  async function choosePlan(){
    const token = localStorage.getItem("token");
    
    try {
      console.log("choose plan runs")
      const res = await axios .post(
        import.meta.env.VITE_BACKEND_URL+"/api/pay/createPayment/"+plan.plan_id,{},{
                headers:{
                    "Authorization": "Bearer "+token
                }
            }
      );
      

      const session = res.data; // { id: "cs_..." }
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) console.error("Stripe redirect error:", error.message);
    } catch (err) {
      toast.error("You already have a plan");
    }
  }




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
        <h3 className="text-xl font-semibold">{plan.plan_name}</h3>
        <p className="mt-1 text-sm text-black/70">{plan.description}</p>
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

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" id="autoRenew" className="h-4 w-4" />
        <label htmlFor="autoRenew" className="text-sm text-black">
          Auto renew
        </label>
      </div>

      <button type="button"
        onClick={() => {
          if (window.confirm("Are you sure you want to choose this plan?")) {
            choosePlan();
          }
        }}
        className={`mt-auto w-full rounded-xl border px-4 py-3 text-sm font-semibold transition
          ${
            plan.popular
              ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
              : "border-black/15 text-black hover:bg-red-600 hover:text-white hover:border-red-600"
          }`}
      >
        Choose 
      </button>
    </article>
  );
}
