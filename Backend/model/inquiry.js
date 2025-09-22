import mongoose from "mongoose";
import generateID from "../utils/idGenerator.js";

const inquirySchema = new mongoose.Schema({
    inquiry_id:{
        type: Number,
        unique: true,
        default : function () {
        return "Inq" + generateID()
    }
    },
    inquiry_type:{
        type: String,
        required: true,
        enum: ['General', 'Technical', 'Billing', 'Feedback', 'Other'],
        default: 'General'
    },
    inquiry_message:{
        type: String,
        required: true,
        
    },
    inquiry_date:{
        type: Date,
        default: Date.now
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']

    },
    inquiry_status:{
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    inquiry_response:{
        type: String,
        default: ''
    }
});
const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;

