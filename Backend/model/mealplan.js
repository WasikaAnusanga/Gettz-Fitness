import mongoose from 'mongoose';
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema;


const mealPlanSchema = new Schema({

    mealPlan_id:{
        type: Number,
        unique: true,
    },

    user_name:{
        type:String,
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

    calaries:{
        type:String,
    }

});

mealPlanSchema.plugin(AutoIncrement, { inc_field: "mealPlan_id" });

const meal= mongoose.model("mealPlan",mealPlanSchema);
export default meal;
