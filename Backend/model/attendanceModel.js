import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  rfid: { type: String, required: true },
  memberName: { type: String },
  time: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
