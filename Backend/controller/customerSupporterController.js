import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CustomerSupporter from "../model/customerSupporter.js";


dotenv.config();

export function getAllCustomerSupporters(req, res) {
    CustomerSupporter.find().then(
        (supporters) => {
            res.json(supporters);
            }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving customer supporters",
                error: err.message
            });
        }
    );
}
export function saveCustomerSupporter(req,res){

    if(req.body.role  == "admin"){
        if(req.user == null){
            res.status(403).json({
                message: "Please login as admin to create a new user"
            });
            return;
        }
        if(req.user.role != "admin"){
            res.status(403).json({
                message: "You are not authorized to create a new admin account "
            });
            return;
        }

    }
const hashedPassword = bcrypt.hashSync(req.body.password,10);
console.log(hashedPassword);

const customerSupporter = new CustomerSupporter({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    profilePicture: req.body.profilePicture || 'default-profile.jpg',
    password: hashedPassword,
    role: req.body.role || 'supporter',
    shiftSchedule: req.body.shiftSchedule,
    notes: req.body.notes
});
customerSupporter.save()
                .then(()=>{
                    res.status(201).json({
                        message: "Customer supporter saved successfully",customerSupporter
                    });
                }).catch((err)=>{
                        res.status(500).json({
                        message: "Error saving customer supporter",
                        error: err.message
                    });
                });
}
export function loginCustomerSupporter(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    CustomerSupporter.findOne({ email: email }).then((supporter) => {
        if (supporter == null) {
            res.status(404).json({
                message: "Customer supporter not found"
            });
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, supporter.password);
            if (isPasswordCorrect) {
                const supporterData = {
                    email: supporter.email,
                    firstName: supporter.firstName,
                    lastName: supporter.lastName,
                    role: supporter.role,
                    supporterId: supporter.supporterId
                };
                const token = jwt.sign(supporterData, process.env.JWT_KEY)
                res.status(200).json({
                    message: "Login successful",
                    data: supporterData,
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect password"
                });
            }
        }
    }).catch((err) => {
        res.status(500).json({
            message: "Error logging in",
            error: err.message
        });
    }
    );
}
export function updateCustomerSupporter(req,res){
    CustomerSupporter.findOneAndUpdate({
        supporterId : req.params.supporterId
    },req.body).then(
        (customerSupporter)=>{
            if(customerSupporter == null){
                res.status(404).json({
                    message: "Customer supporter not found"
                });
            }else{
                res.json({
                    message : "Update Sucessfully"
                });
            }
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Error Update Customer Supporter"
            })
        }
    )
}
export async function getCustomerSupporterById(req,res){
    const supporterId = req.params.id;
    const supporter = await CustomerSupporter.findOne({supporterId: supporterId})
    if(supporter == null){
        res.status(404).json({
            message: "Customer supporter not found"
        })
        return
    }
    res.json({
        supporter: supporter
    });
}
export function deleteCustomerSupporter(req, res) {
    const supporterId = req.params.id;
    CustomerSupporter.findOneAndDelete({ supporterId: supporterId }).then(
            (supporter) => {
        if (supporter == null) {
            res.status(404).json({
                message: "Customer supporter not found"
            });
        } else {
            res.json({
                message: "Customer supporter deleted successfully"
            });
        }
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting customer supporter",
            error: err.message
        });
    });
}
