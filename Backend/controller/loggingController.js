import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../model/admin.js";
import EquipmentManager from "../model/equipmentManager.js";
import Trainer from "../model/trainer.js";
import CustomerSupporter from "../model/customerSupporter.js";
dotenv.config();

function norm(r) { return String(r || '').replace(/\s+/g, '').toLowerCase(); }

export default async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const roleKey = norm(req.body.role);

    let Model, notFoundMsg;
    if (roleKey === 'admin')                { Model = Admin; notFoundMsg = 'Admin not found'; }
    else if (roleKey === 'equipmentmanager'){ Model = EquipmentManager; notFoundMsg = 'Equipment Manager not found'; }
    else if (roleKey === 'trainer')         { Model = Trainer; notFoundMsg = 'Trainer not found'; }
    else if (roleKey === 'customersupporter'){ Model = CustomerSupporter; notFoundMsg = 'Customer Supporter not found'; }
    else return res.status(400).json({ message: 'Unsupported role' });

    const user = await Model.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: notFoundMsg });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY);

    const safe = user.toObject();
    delete safe.password;
    return res.json({ message: 'Login successful', token, user: safe });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
}


            