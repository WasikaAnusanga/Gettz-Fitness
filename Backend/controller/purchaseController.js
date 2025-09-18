import Purchase from "../model/purchase.js";

//get all purchases
export const getAllPurchases= async (req ,res)=>{
    let purchase;
    //check
    try{
        purchase= await Purchase.find();
        if(!purchase){
            //not found
            return res.status(404).json({message:"Purchases not found"});
        }
        //dislay
        return res.status(200).json({message:"Found",purchase});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Server error",error: err.message});
    }
};

//insert purchase
export const addPurchase= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const{
            P_date,
            P_cost,
            P_quantiy,
            P_item,
            P_note
        }=req.body;
        let purchase;
        try{
            purchase= new Purchase({
                P_date,
                P_cost,
                P_quantiy,
                P_item,
                P_note
            });
            await purchase.save();
        }catch(err){
            console.log(err);
        }
        //not inserted
        if(!purchase){
            return res.status(404).json({message:"Unable to add purchase"});
        }
        return res.status(200).json({message:"Purchase added successfully",purchase});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

//get by id 
export const getPurchaseById= async (req ,res)=>{
    const id=req.params.id;
    let purcahse;
    try{
        purcahse= await Purchase.findById(id);
    }catch(err){
        console.log(err);
    }
    //not found
    if(!purcahse){
        return res.status(404).json({message:"Purchase not found"});
    }
    return res.status(200).json({message:"Found",purcahse});
};

//update purchase
export const updatePurchase= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        const{
            P_date,
            P_cost,
            P_quantiy,
            P_item,
            P_note
        }=req.body;
        let purchase;
        try{
            purchase= await Purchase.findByIdAndUpdate(id,{
                P_date,
                P_cost,
                P_quantiy,
                P_item,
                P_note
            },{new:true});
        }catch(err){
            console.log(err);
        }
        //not updated
        if(!purchase){
            return res.status(404).json({message:"Unable to update purchase"});
        }
        return res.status(200).json({message:"Purchase updated successfully",purchase});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};

//delete purchase
export const deletePurchase= async (req ,res)=>{
    //check user is an equipmentmanager
    req.user={role:"Equipment Manager"};
    if(req.user.role=="Equipment Manager"){
        const id=req.params.id;
        let purcahse;
        try{
            purcahse= await Purchase.findByIdAndDelete(id);
        }catch(err){
            console.log(err);
        }
        //not deleted
        if(!purcahse){
            return res.status(404).json({message:"Unable to delete purchase"});
        }
        return res.status(200).json({message:"Purchase deleted successfully"});
    }else{
        res.status(401).json({
            message:"You need Equipment Manager access"
        });
    }
};