import mongoose from 'mongoose';
import generateID from "../utils/idGenerator.js";    

const CustomerSupporterSchema = new mongoose.Schema({
    supporterId: {
        type: String,
        unique: true,
        default : function () {
              return "Cus" + generateID()
            }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePicture: { 
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'supporter'
    },
    shiftSchedule: {
        type: String
    },
    solveCount: { 
        type: Number,
        default: 0
    }, 
    ratingAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const CustomerSupporter = mongoose.model('CustomerSupporter',CustomerSupporterSchema)
export default CustomerSupporter;



