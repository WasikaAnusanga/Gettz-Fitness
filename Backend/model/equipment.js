import mongoose from 'mongoose';
const { Schema } = mongoose;



//equipment schema
const EquipmentSchema = new Schema({
    Eq_code: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    Eq_name: {
        type: String,
        required: true,
        trim: true,
    },
    Eq_type: {
        type: String,
        required: true
    },
    Eq_status: {
        type: String,
        enum: ['Available', 'In use', 'Under Maintenance'],
        default: 'Available',
        required: true
    },
    Eq_repairNote: {
        type: String,
        default: 'No issues'
    },
    Eq_supplier: {
        type: String,
        trim: true
    },
    IM_ID: {
        type: Schema.Types.ObjectId,
        ref: 'equipmentManager',
        required: true
    }

});


const Equipment = mongoose.model("Equipment", EquipmentSchema);
export default Equipment; 