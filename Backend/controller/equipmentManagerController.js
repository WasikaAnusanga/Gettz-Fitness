import bcrypt from "bcrypt";
import dotenv from "dotenv";
import loggingController from "./loggingController.js";
import EquipmentManager from "../model/equipmentManager.js";

dotenv.config();
export async function registerEquipmentManager(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Please login as admin to create a new user" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to create a new equipment manager account" });
    }

    const { name, email, phoneNumber, address, password } = req.body;
    if (!name || !email || !phoneNumber || !address || !password) {
      return res.status(400).json({ message: "name, email, phoneNumber, address and password are required" });
    }

    const exists = await EquipmentManager.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const payload = {
      ...req.body,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "Equipment Manager",
    };

    const created = await EquipmentManager.create(payload);

    const { password: _pw, ...safe } = created.toObject();
    return res.status(201).json({
      message: "Equipment Manager registered successfully",
      data: safe,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering equipment manager",
      error: err.message,
    });
  }
}

export async function getAllEquipmentManagers(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      EquipmentManager.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).select("-password"),
      EquipmentManager.countDocuments(filter),
    ]);

    return res.json({
      page,
      limit,
      total,
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving equipment managers",
      error: err.message,
    });
  }
}

/**
 * POST /api/equipment-managers/login
 * Hand off to your existing loggingController, but set an expected role string.
 * If your auth system checks role strictly, stay consistent with your schema.
 */
export function loginEquipmentManager(req, res) {
  req.body.role = "Equipment Manager";
  return loggingController(req, res);
}

export async function updateEquipmentManager(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Please login as admin to update an equipment manager" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update an equipment manager account" });
    }

    const update = { ...req.body };

    if (update.email) update.email = update.email.toLowerCase();

    if (update.password) {
      update.password = bcrypt.hashSync(update.password, 10);
    }

    if (update.role && update.role !== "Equipment Manager") {
      update.role = "Equipment Manager";
    }

    const updatedManager = await EquipmentManager.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
      projection: "-password",
    });

    if (!updatedManager) {
      return res.status(404).json({ message: "Equipment Manager not found" });
    }

    return res.json({
      message: "Equipment Manager updated successfully",
      data: updatedManager,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating equipment manager",
      error: err.message,
    });
  }
}

export async function getEquipmentManagerById(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const manager = await EquipmentManager.findById(req.params.id).select("-password");
    if (!manager) {
      return res.status(404).json({ message: "Equipment Manager not found" });
    }
    return res.json({ data: manager });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving equipment manager",
      error: err.message,
    });
  }
}


export async function deleteEquipmentManager(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Please login as admin to delete an equipment manager" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete an equipment manager account" });
    }

    const deleted = await EquipmentManager.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Equipment Manager not found" });
    }
    return res.json({ message: "Equipment Manager deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting equipment manager",
      error: err.message,
    });
  }
}
