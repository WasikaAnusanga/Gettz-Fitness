import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import loggingController from "./loggingController.js";
import Admin from '../model/admin.js';

dotenv.config();

export function saveAdmin(req,res){
const hashedPassword = bcrypt.hashSync(req.body.password,10);
console.log(hashedPassword);

const admin = new Admin({
    adminId: req.body.adminId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    profilePicture: req.body.profilePicture || 'default-profile.jpg',
    password: hashedPassword,
    role: req.body.role || 'Admin',
    isDisabled: req.body.isDisabled || false,
    lastLogin: req.body.lastLogin || null
});
admin.save()
                .then(()=>{
                    res.status(201).json({
                        message: "admin saved successfully",admin
                    });
                }).catch((err)=>{
                        res.status(500).json({
                        message: "Error saving admin",
                        error: err.message
                    });
                });
}

export function adminLoging(req,res){
    req.body.role = 'admin';  
    return loggingController(req, res);
}

