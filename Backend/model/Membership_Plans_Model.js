import mongoose from "mongoose";

const plansSchema = new mongoose.Schema({
    
        plan_id:{
        type:Number,
        required:true,
        unique:true
    },

    plan_name:{
        type:String,
        required:true,
    },

    price:{
        type:Number,
        required:true,
        min: 0
    },
    duration:{
        type:Number,
        required:true,
        min: 1,
        default:30
    },

    description:{
        type:String,
        required:true
    },
    isDisabled:{
        type:Boolean,
        required:true,
        default:false
    },
})

const MembershipPlan= mongoose.model("MembershipPlan",plansSchema);

export default MembershipPlan;

 