import mongoose, { Mongoose } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema;


const mealRequestSchema = new Schema({

    request_id:{
        type: Number,
        unique: true,
    },

    user_id:{
        type: Number,
    },

    user_name:{
        type: String,
    },

    last_name:{
        type: String,
    },

    request_date:{
        type: String,
    },

    weight:{
        type: String,
    },

    height:{
        type: String,
    },

    birthday:{
        type: String,
    },

    description:{
        type: String,
    },

    mealType:{
        type: String,
    }

});

mealRequestSchema.plugin(AutoIncrement, {inc_field: 'request_id'});

const mealRequest = mongoose.model("mealRequest", mealRequestSchema);
export default mealRequest;