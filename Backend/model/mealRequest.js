import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mealRequestSchema = new Schema({

    request_id:{
        type: Number,
        unique: true,
        required: true,
    },

    user_id:{
        type: Number,
    },

    user_name:{
        type: String,
    },

    request_date:{
        trype: String,
    },

    weight:{
        type: String,
    },

    height:{
        type: String,
    },

});

const mealRequest = mongoose.model("mealRequest", mealRequestSchema);
export default mealRequest;