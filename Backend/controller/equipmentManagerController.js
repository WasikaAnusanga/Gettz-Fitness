import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import loggingController from "./loggingController.js";
import EquipmentManager from "../model/equipmentManager.js";

dotenv.config();

export async function registerEquipmentManager(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "Please login as admin to create a new user"
        });
        return;
    }
    if (req.user.role != "admin") {
        res.status(403).json({
            message: "You are not authorized to create a new equipment manager account"
        });
        return;
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const equipmentManager = {
        ...req.body,
        password: hashedPassword,
        role: 'equipmentManager'
    };

    try {
        await EquipmentManager.saveUser(equipmentManager);
        res.status(201).json({
            message: "Equipment Manager registered successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error registering equipment manager",
            error: err.message
        });
    }
}
export function getAllEquipmentManagers(req, res) {
    EquipmentManager.find().then(
        (managers) => {
            res.json(managers);
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving equipment managers",
                error: err.message
            });
        }
    );
}
export function loginEquipmentManager(req, res) {
    req.body.role = 'equipmentManager';  
    return loggingController(req, res);
}
export function updateEquipmentManager(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "Please login as admin to update an equipment manager"
        });
        return;
    }
    if (req.user.role != "admin") {
        res.status(403).json({
            message: "You are not authorized to update an equipment manager account"
        });
        return;
    }

    EquipmentManager.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedManager) => {
            res.json({
                message: "Equipment Manager updated successfully",
                updatedManager
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error updating equipment manager",
                error: err.message
            });
        });
}
export async function getEquipmentManagerById(req, res) {
    const managerId = req.params.id;
    try {
        const manager = await EquipmentManager.findById(managerId);
        if (!manager) {
            return res.status(404).json({
                message: "Equipment Manager not found"
            });
        }
        res.json({
            manager
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error retrieving equipment manager",
            error: err.message
        });
    }
}
export function deleteEquipmentManager(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "Please login as admin to delete an equipment manager"
        });
        return;
    }
    if (req.user.role != "admin") {
        res.status(403).json({
            message: "You are not authorized to delete an equipment manager account"
        });
        return;
    }

    EquipmentManager.findByIdAndDelete(req.params.id)
        .then((deletedManager) => {
            if (!deletedManager) {
                return res.status(404).json({
                    message: "Equipment Manager not found"
                });
            }
            res.json({
                message: "Equipment Manager deleted successfully"
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error deleting equipment manager",
                error: err.message
            });
        });
}
