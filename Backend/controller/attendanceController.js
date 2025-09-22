import Attendance from "../model/attendanceModel.js";
import Member from "../model/memberModel.js";

// Create new attendance record
export const markAttendance = async (req, res) => {
  try {
    const { rfid } = req.body;

    // Find member by RFID
    const member = await Member.findOne({ rfid });
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Save attendance
    const record = new Attendance({ rfid, memberName: member.name });
    await record.save();

    // Emit realtime update
    req.io.emit("attendanceUpdate", { rfid, memberName: member.name });

    res.json({ message: "Attendance marked", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attendance
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
