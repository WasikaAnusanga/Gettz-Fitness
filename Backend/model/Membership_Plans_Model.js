import mongoose from "mongoose";

const plansSchema = new mongoose.Schema({
    plan_id: {
        type: Number,
        required: true,
        unique: true
    },
    plan_name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        default: 30
    },
    description: {
        type: String,
        required: true
    },
    isDisabled: {
        type: Boolean,
        required: true,
        default: false
    },
    popular:{
        type:Boolean,
        default:false
    },
    features: {
        type: [String],  // array of strings
        required: true,
        default: [
            "Access to all exercise videos",
            "Progress tracking",
            "Supportive online community",
            "Personalized workout plan",
            "Basic nutrition guidance",
            "Group fitness classes"
        ]
    }
});

const MembershipPlan = mongoose.model("MembershipPlan", plansSchema);

export default MembershipPlan;
