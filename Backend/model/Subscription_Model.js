import mongoose from "mongoose";
import "./user.js";
import "./Membership_Plans_Model.js";
const subSchema = new mongoose.Schema({
    
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "canceled", "pending"], default: "pending" },
    auto_renew: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const Subscription= mongoose.model("Subscription",subSchema);

export default Subscription;

 