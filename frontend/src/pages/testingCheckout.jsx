import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function TestingCheckout() {
  const handleClick = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pay/createPayment/1`,{},{
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
      console.log("You already Have a plan")
    }
  };

  return (
    <button onClick={handleClick} className="w-[150px] h-[50px] bg-red-900 cursor-pointer">
      Checkout Button
    </button>
  );
}
