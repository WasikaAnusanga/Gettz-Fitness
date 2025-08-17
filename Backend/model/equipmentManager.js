import mongoose from 'mongoose';
import Counter from './counter.js';

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
});
equipmentManagerSchema.pre("save",async function(next){
    if(this.isNew){
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'equipmentManagerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.equipmentManagerId = `equipmentManagerId ${counter.seq}`;
    }
    next();
})
const EquipmentManager = mongoose.model('EquipmentManager',equipmentManagerSchema)
export default EquipmentManager;

