import Member from "../model/memberModel.js";

// Register new member
export const registerMember = async (req, res) => {
  try {
    const { rfid, name, isActive, membershipExpiry } = req.body;
    const member = new Member({ rfid, name, isActive, membershipExpiry });
    await member.save();
    res.json({ message: "Member registered successfully", member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check member status by RFID
export const checkMember = async (req, res) => {
  try {
    const { rfid } = req.params;
    const member = await Member.findOne({ rfid });

    if (!member) return res.json({ status: "NOT_FOUND" });

    if (member.isActive && (!member.membershipExpiry || member.membershipExpiry > new Date())) {
      res.json({ status: "ACTIVE", member });
    } else {
      res.json({ status: "INACTIVE", member });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
