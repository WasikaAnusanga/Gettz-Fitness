import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../model/admin.js";
dotenv.config();

export default function logiAdminController(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if(role == "Admin"){
        Admin.findOne({
            email : email
        }).then((admin)=>{
            if(admin == null){
                return res.status(404).json({
                    message: "Admin not found"
                })
            }else{
                const isPasswordValid = bcrypt.compareSync(password, admin.password);
                if(isPasswordValid){
                    const AdminData = {
                        email : admin.email,
                        firstName : admin.firstName,
                        lastName : admin.lastName,
                        phone : admin.phone,
                        profilePicture : admin.profilePicture,
                        role : admin.role,
                        isDisabled : admin.isDisabled,
                        adminId : admin.adminId
                    };
                    const token = jwt.sign(AdminData,process.env.JWT_KEY)
                    res.json({
                        message: "Login successful",
                        token: token,
                        user: AdminData
                    });
                }else{
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }
            }
        })

    }else if(role == "Equipment Manager"){
        EquipmentManager.findOne({
            email : email
        }).then((equipmentManager)=>{
            if(equipmentManager == null){
                return res.status(404).json({
                    message: "Equipment Manager not found"
                })
            }else{
                const isPasswordValid = bcrypt.compareSync(password, equipmentManager.password);
                if(isPasswordValid){
                    const EquipmentManagerData = {
                        name : equipmentManager.name,
                        email : equipmentManager.email,
                        phoneNumber : equipmentManager.phoneNumber,
                        address : equipmentManager.address,
                        profilePicture : equipmentManager.profilePicture,
                        role : equipmentManager.role,
                        equipmentList : equipmentManager.equipmentList,
                        shiftSchedule : equipmentManager.shiftSchedule,
                        maintenanceSchedule : equipmentManager.maintenanceSchedule,
                        equipmentManagerId : equipmentManager.equipmentManagerId,
                        isDisabled : equipmentManager.isDisabled,
                        createdAt : equipmentManager.createdAt,
                        updatedAt : equipmentManager.updatedAt

                    };
                    const token = jwt.sign(EquipmentManagerData,process.env.JWT_KEY)
                    res.json({
                        message: "Login successful",
                        token: token,
                        user: EquipmentManagerData
                    });
                }else{
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }
            }
        })
    }else if(role == "Trainer"){
        Trainer.findOne({
            email : email
        }).then((trainer)=>{
            if(trainer == null){
                return res.status(404).json({
                    message: "Trainer not found"
                })
            }else{
                const isPasswordValid = bcrypt.compareSync(password, trainer.password);
                if(isPasswordValid){
                    const TrainerData = {
                        firstName : trainer.firstName,
                        lastName : trainer.lastName,
                        email : trainer.email,
                        phone : trainer.phone,
                        profilePicture : trainer.profilePicture,
                        role : trainer.role,
                        trainerId : trainer.trainerId,
                        specialization : trainer.specialization,
                        certifications : trainer.certifications,
                        experienceYears : trainer.experienceYears,
                        rating : trainer.rating,
                        reviews : trainer.reviews,
                        isActive : trainer.isActive,
                        isDisabled : trainer.isDisabled

                    };
                    const token = jwt.sign(TrainerData,process.env.JWT_KEY)
                    res.json({
                        message: "Login successful",
                        token: token,
                        user: TrainerData
                    });
                }else{
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }
            }
        })
    }

}

            