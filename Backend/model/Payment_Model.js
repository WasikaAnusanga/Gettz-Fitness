import mongoose from "mongoose";
import "./user.js";
import "./Subscription_Model.js";

const paymentSchema = new mongoose.Schema({
    payment_id:{type:Number,required:true},
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription"},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "LKR" },
    //method: { type: String, enum: ["card", "wallet", "bank", "cash"], required: true },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    gateway_txn_id: { type: String, unique: true, sparse: true }, // may be null until paid
    paid_at: { type: Date },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
)

const Payment= mongoose.model("Payment",paymentSchema);

export default Payment;