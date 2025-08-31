import mongoose, { Schema } from "mongoose";
import generateID from "../utils/idGenerator.js";


const challengeSchema = new mongoose.Schema({
    challengeID:{
        type : String,
        required : true,
        unique : true,
        default : function () {
            return "Chlnge" + generateID()
        }
    },

    title : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true,
        default : "None"
    },

    points : {
        type : Number,
        required :true
    },

    startDate :{
        type:  Date,
        required :true,
    },

    endDate :{
        type:  Date,
        required :true
    },
    admin_id :{
        type: Schema.Types.ObjectId, 
        ref: 'User', required: true
    },

}, {timestamps: true });

const Challenge = mongoose.model("challenge", challengeSchema);
export default Challenge;