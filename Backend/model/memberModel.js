import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  rfid: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  membershipExpiry: { type: Date }
}, { timestamps: true });

export default mongoose.model("Member", memberSchema);
