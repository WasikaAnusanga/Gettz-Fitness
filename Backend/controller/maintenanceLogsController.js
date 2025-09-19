import MaintenanceLog from "../model/maintenanceLogs.js";

//get all maintenance logs
export const getAllMaintenanceLogs= async (req, res)=>{
    let maintenanceLogs;
    //checking
    try{
        maintenanceLogs= await MaintenanceLog.find();
        if(!maintenanceLogs){
            //not found
            return res.status(404).json({message:"Maintenance logs not found"});
        }
        //display
        return res.status(200).json({message:"Found",maintenanceLogs});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error: err.message});
    }
};

//insert maintenance log
export const addMaintenanceLog= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const {
            M_Eq_name,
            M_description,
            M_logType,
            M_date,
            Eq_ID
        }=req.body;
        let maintenanceLog;
        try{
            maintenanceLog= new MaintenanceLog({
                M_Eq_name,
                M_description,
                M_logType,
                M_date,
                Eq_ID
            });
            await maintenanceLog.save()
        }catch(err){
            console.log(err);
        }
        //not inserted
        if(!maintenanceLog){
            return res.status(404).json({message: "Unable to add maintenance log"});
        }
        return res.status(200).json({message: "Maintenance log added successfully",maintenanceLog});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

