import Stripe from "stripe";
import Subscription from "../model/Subscription_Model.js";
import Payment from "../model/Payment_Model.js";
import MembershipPlan from "../model/Membership_Plans_Model.js";
import { sendPaymentReciept } from "../utils/mailer.js";
const stripe = new Stripe(process.env.SECRET_KEY);

export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_KEY
    );
  } catch (e) {
    console.error("Webhook signature verification failed:", e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Session Checked Supp");
        const session = event.data.object; // Stripe.Checkout.Session

        // 1) Update local payment
        const pay = await Payment.findOneAndUpdate(
          { session_id: session.id },
          {
            status: "paid",
          },
          { new: true }
        );

        // 2) Create/activate subscription in YOUR system (now safe)
        try {
          const userId = session.metadata?.userId; // optional if you want to pass one
          const planId = session.metadata?.planId;
          const email = session.customer_details?.email;
          const sub = await Subscription.findOneAndUpdate(
            { user_id: userId },
            { status: "active" }
          );
          const top = await Subscription.aggregate([
            { $match: { status: "active" } },
            { $group: { _id: "$plan_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
          ]);
          await sendPaymentReciept(email,session.id)
          const plan=await MembershipPlan.findById(top)
          plan.popular=true;
          
          await plan.save()

        } catch (subErr) {
          console.error(
            "Sub creation failed:",
            subErr?.response?.data || subErr.message
          );
          // you might want to queue retry
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        await Payment.findOneAndUpdate(
          { session_id: session.id },
          { status: "canceled" }
        );
        break;
      }

      // (Optional safety) If you also receive payment_intent events:
      case "payment_intent.payment_failed": {
        console.log("Canceled Called");
        const pi = event.data.object;
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: pi.id,
          limit: 1,
        });
        const sessionId = sessions.data?.[0]?.id;
        await Payment.findOneAndUpdate(
          { session_id: sessionId },
          { status: "failed" }
        );
        break;
      }

      default:
        // ignore
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    // still 2xx so Stripe doesn’t retry forever if it’s your bug
    return res.status(200).json({ received: true });
  }
}
