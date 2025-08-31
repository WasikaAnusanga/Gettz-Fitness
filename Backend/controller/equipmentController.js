import Equipment from '../model/equipment.js';

//get all equipment
export const getAllEquipment= async (req, res)=>{
    let equipment;
    //checking
    try{
        equipment= await Equipment.find();
        if(!equipment){
            //not found
            return res.status(404).json({message:"Equipment not found"});
            }
        //display
        return res.status(200).json({message:"Found",equipment});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error: err.message});
    }
};

//insert equipment
export const addEquipment= async (req ,res)=>{

    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};

    if(req.user.role=="Equipment Manager"){
        const {
            Eq_name,
            Eq_type,
            Eq_status,
            Eq_repairNote,
            Eq_supplier,
            IM_ID
        }=req.body;

        let equipment;
        
        try{
            equipment= new Equipment({
                Eq_name,
                Eq_type,
                Eq_status,
                Eq_repairNote,
                Eq_supplier,
                IM_ID
            });
            await equipment.save()
        }catch(err){
            console.log(err);
        }
        //not inserted
        if(!equipment){
            return res.status(404).json({message: "Unable to add equipment"});
        }
        return res.status(200).json({message: "Equipment addes successfully",equipment});
    }else {
        res.status(401).json({
        message:"You need Equipment Manager access"
        });
    }
}

//get by id 

export const getById= async (req, res)=>{
    const id=req.params.id;
    let equipment;
    try{
        equipment= await Equipment.findById(id);
    }catch(err){
        console.log(err);
    }
    //not found
    if(!equipment){
        return res.status(404).json({message:"Equipment not found"});
    }
    return res.status(200).json({equipment});
}

//update equipment

export const updateEquipment= async(req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        const {
            Eq_name,
            Eq_type,
            Eq_status,
            Eq_repairNote,
            Eq_supplier,
            IM_ID
        }=req.body;
        let equipment;
        try{
            equipment= await Equipment.findByIdAndUpdate(id,{
                Eq_name,
                Eq_type,
                Eq_status,
                Eq_repairNote,
                Eq_supplier,
                IM_ID
            },{new:true});
        }catch(err){
            console.log(err);
        }
        //not updated
        if(!equipment){
            return res.status(404).json({message: "Unable to update equipment"});
        }
        return res.status(200).json({message: "Equipment updated successfully",equipment});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

//delete equipment
export const deleteEquipment= async (req, res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        let equipment;
        try{
            equipment= await Equipment.findByIdAndDelete(id);
        }catch(err){
            console.log(err);
        }
        //not deleted
        if(!equipment){
            return res.status(404).json({message: "Unable to delete equipment"});
        }
        return res.status(200).json({message: "Equipment deleted successfully"});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

