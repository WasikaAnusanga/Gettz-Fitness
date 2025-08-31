import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mealPlanSchema = new Schema({

    mealPlan_id:{
        type: Number,
        unique: true,
        required: true,
    },

    meal_name:{
        type:String
    },

    description:{
        type:String
    },

    meal_type:{
        type:String
    },

    duration:{
        type:String
    },

});


const meal= mongoose.model("mealPlan",mealPlanSchema);
export default meal;
