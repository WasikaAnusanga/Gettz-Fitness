import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/user.js';


dotenv.config();

export function saveUser(req,res){
    if(req.body.role=="admin"){
        if(req.user==null){
            res.status(400).json({
            message : "Please login as an admin to create a user"
        });
        return;
        } 
    
    if(req.body.role != "admin"){
        res.status(400).json({
            message : "You are not authorized to create a new admin account"
        });
            return;
        }
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashedPassword);
    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hashedPassword,
        phone : req.body.phone,
        Height : req.body.Height,
        Weight : req.body.Weight,
        dob : req.body.dob,

    });
    user.save()
    .then(() =>{
        res.status(201).json({
            message: "User saved sucessfully"
        });
    })
    .catch((err)=>{
        res.status(500).json({
            message: "Error saving user",
            error: err.message
    })
})
}
export function loginUser(req, res) {
    const  email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then((user) => {
        if(user == null){
            res.json({
                message: "User not found"
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if(isPasswordCorrect){
               
                const userData = {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    phone : user.phone,
                    Height : user.Height,
                    Weight : user.Weight,
                    dob : user.dob,
                    profilePicture: user.profilePicture,
                    point : user.point,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    isDisabled : user.isDisabled,
                    isEmailVerified : user.isEmailVerified
                };
              const token = jwt.sign(userData,process.env.JWT_KEY)
                res.json({
                    message: "Login successful",
                    token: token,
                    user: userData
                });  
        }else{
            res.json({
                message: "Incorrect password"
            });
            
        }
    }
})
}

export function getAllUsers(req,res){
    User.find().then(
        (users) => {
            res.status(200).json({
                message: "Users fetched successfully",
                users: users
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error fetching users",
                error: err.message
            });
        }
    )
}

export async function getUserById(req, res) {
    const userId = req.params.id;
    const user = await User.findOne({userId: userId})
    if(user == null){
        res.status(404).json({
            message: "User not found"
        })
        return
    }
    res.json({
        user: user
    })
}

export function updateUser(req, res) {
    User.findOneAndUpdate({
        userId: req.params.id
    },req.body).then(
        (user) => {
            if(user == null){
                res.status(404).json({
                    message: "User not found"
                });
            }else{
                res.status(200).json({
                message: "User updated successfully",
                user: user
                });
            }
            
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error updating user",
                error: err.message
            });
        }
    )
}
export function deleteUser(req, res) {
    if(req.user == null){
        res.status(400).json({
            message: "Please login to delete a user"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(400).json({
            message: "You are not authorized to delete a user"
        });
        return;
    }
    
    User.findOneAndDelete({
        userId: req.params.id
    }).then(
        (user) => {
            if(user == null){
                res.status(404).json({
                    message: "User not found"
                });
            }else{
                res.status(200).json({
                    message: "User deleted successfully",
                    user: user
                });
            }
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error deleting user",
                error: err.message
            });
        }
    )
}
export function updateUserRole(req,res){
    if(req.user == null){
        res.status(400).json({
            message: "Please login to update user role"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(400).json({
            message: "You are not authorized to update user role"
        });
        return;
    }
    
    User.findOneAndUpdate(
        { userId: req.params.id },
        { role: req.body.role },
        { new: true }
    ).then(
        (user) => {
            if(user == null){
                res.status(404).json({
                    message: "User not found"
                });
            }else{
                res.status(200).json({
                    message: "User role updated successfully",
                    user: user
                });
            }
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error updating user role",
                error: err.message
            });
        }
    )
}

