import mongoose from 'mongoose';

const equipmentManagerSchema = new mongoose.Schema({
    equipmentManagerId:{
        type: String,
        unique: true
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
        default: 'Equipment Manager'
    },
    shiftSchedule: {
        type: String
    },
    equipmentList: [{
        equipmentName: String,
        quantity: Number,
        condition: String
    }],
    maintenanceSchedule: {
        type: String
    },
})