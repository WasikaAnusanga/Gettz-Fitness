import mongoose, { Schema } from "mongoose";
import generateID from "../utils/idGenerator.js";


const challengeSchema = new mongoose.Schema({
    challengeID:{
        type : String,
        required : true,
        unique : true,
        default : function () {
            return "Chl" + generateID()
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

    imageUrl: { 
        type: String 
    },

    admin_id :{
        type: Schema.Types.ObjectId, 
        ref: 'Admin', required: true
    },

}, {timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;