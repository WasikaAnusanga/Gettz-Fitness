import Stripe from "stripe";
import Subscription from "../model/Subscription_Model.js";

const stripe = new Stripe([process.env.SECRET_KEY]); // 🔑 use your secret key

const endpointSecret = process.env.WEBHOOK_KEY; // from Stripe Dashboard

export async function handleWebhook(req, res){
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // 🔑 req.body here is raw Buffer (because of express.raw)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Normal event handling
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = session.metadata.userId; // Your local user ID
      const planObjId=session.metadata.planObjId
      const plan_id=session.metadata.plan_id
      const subscriptionIds = session.subscription; // Stripe subscription ID

      console.log("Web Hook runnning")
      // Save to DB:
      const subs=await Subscription.findOne({user_id:userId})
      subs.user_id = userId;   
      subs.plan_id = planObjId;
      subs.stripeSubscriptionId=subscriptionIds 
      subs.status="pending" 
      await subs.save()
      

      // userId, stripeCustomerId (session.customer), stripeSubscriptionId
      console.log("User:", userId, "Subscription:", subscriptionIds);
      console.log("Checkout completed ✅", event.data.object.id);
      // Save subscription & customer in DB
      break;

    case "invoice.paid":
      const invoice = event.data.object;
      let subscriptionId = invoice.subscription || invoice.lines?.data?.[0]?.subscription;

      console.log("Invoice paid 💰", invoice.id);

      // Get subscription details from Stripe to grab period start & end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodStart = new Date(subscription.current_period_start * 1000);
      const periodEnd = new Date(subscription.current_period_end * 1000);

      // Update your DB subscription
      let sub = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
      if (sub) {
        sub.status = "active";
        sub.start_date = periodStart;
        sub.end_date = periodEnd;
        await sub.save();
        console.log("Subscription activated ✅", subscriptionId);
      }
      break;

    case "invoice.payment_failed":
      console.log("Payment failed ❌", event.data.object.id);
      // Notify user to update payment method
      break;

    case "customer.subscription.deleted":
      console.log("Subscription canceled ⚠️", event.data.object.id);
      // Mark subscription CANCELED in DB
      break;

    default:
    //console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};
