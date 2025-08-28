import Subscription from "../model/Subscription_Model.js";
import Payment from "../model/Payment_Model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY);


export async function createPayment(req,res){
    try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",   // change to your currency
            product_data: {
              name: "Fitness Package",
            },
            unit_amount: 2000, // $20.00 (amount in cents)
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

export function verifyPayment(req,res){
    console.log("Verifying Payment")
}