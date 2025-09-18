import Subscription from "../model/Subscription_Model.js";

export async function expirePastEndDates() {
  const now = new Date();  
  const result = await Subscription.updateMany(
    { end_date: { $lt: now }, status: { $ne: "expired" } },
    { $set: { status: "expired" } }
  );
  console.log(`Expired ${result.modifiedCount} subscriptions`);
}
