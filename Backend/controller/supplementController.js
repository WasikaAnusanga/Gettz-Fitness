import Supplement from "../model/supplement.js";

//get all supplements
export const getAllSupplements= async (req ,res)=>{
    let supplement;
    //check
    try{
        supplement= await Supplement.find();
        if(!supplement){
            //not found
            return res.status(404).json({message:"Supplements not found"});
        }
        //dsiplay
        return res.status(200).json({message:"Found",supplement});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error: err.message});
    }
};

//insert supplment
export const addSupplement= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const{
            Sup_name,
            Sup_type,
            Sup_price,
            Sup_status,
            Sup_quantity,
            Sup_supplier,
            IM_ID,
            Sup_image
        }=req.body;

        let supplement;
        try{
            supplement= new Supplement({
                Sup_name,
                Sup_type,
                Sup_price,
                Sup_status,
                Sup_quantity,
                Sup_supplier,
                IM_ID,
                Sup_image
            });
            await supplement.save();
        }catch(err){
            console.log(err);
        }
        //not inserted
        if(!supplement){
            return res.status(404).json({message:"Unable to add supplement"});
        }
        return res.status(200).json({message:"Supplement added successfully",supplement});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

//get by id
export const getSupplementById= async (req ,res)=>{
    const id=req.params.id;
    let supplement;
    try{
        supplement=await Supplement.findById(id);
    }catch(err){
        console.log(err);
    }
    //not found
    if(!supplement){
        return res.status(404).json({message:"Supplement not found"});
    }
    return res.status(200).json({supplement});
};

//update supplement
export const updateSupplement= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        const{
            Sup_name,
            Sup_type,
            Sup_price,
            Sup_status,
            Sup_quantity,
            Sup_supplier,
            IM_ID,
            Sup_image
        }=req.body
        let supplement;
        try{
            supplement= await Supplement.findByIdAndUpdate(id,{
                Sup_name,
                Sup_type,
                Sup_price,
                Sup_status,
                Sup_quantity,
                Sup_supplier,
                IM_ID,
                Sup_image
            },{new:true});
        }catch(err){
            console.log(err);
        }
        //not updated
        if(!supplement){
            return res.status(404).json({message:"Unable to update supplement"});
        }
        return res.status(200).json({message:"Supplement updated successfully",supplement});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

//delete supplement
export const deleteSupplement= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        let supplement;
        try{
            supplement= await Supplement.findByIdAndDelete(id);
        }catch(err){
            console.log(err);
        }
        //not deleted
        if(!supplement){
            return res.status(404).json({message:"Unable to delete supplement"});
        }
        return res.status(200).json({message:"Supplement deleted successfully"});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};