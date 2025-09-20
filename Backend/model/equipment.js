import mongoose from 'mongoose';
const schema = mongoose.Schema;

//equipment schema
const EquipmentSchema = new schema({
    Eq_code:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    Eq_name:{
        type:String,
        required:true
    },
    Eq_type:{
        type:String,
        required:true
    },
    Eq_status:{
        type:String,
        enum:['Available','In use','Under Maintenance'],
        default:'Available',
        required:true
    },
    Eq_repairNote:{
        type:String,
        default:'No issues'
    },
    Eq_supplier:{
        type:String
    },
    IM_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'equipmentManager',
        required:true
    }
});

const Equipment= mongoose.model("Equipment",EquipmentSchema);
export default Equipment; 