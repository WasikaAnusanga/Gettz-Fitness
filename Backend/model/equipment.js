import mongoose from 'mongoose';
import Counter from "./counter.js";
const { Schema } = mongoose;

//equipment schema
const EquipmentSchema = new Schema({
    Eq_code: {
        type: String,
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

const CODE_PREFIX = "EQ-";
const PAD = 4;
EquipmentSchema.pre("validate", async function (next) {
    try {
        if (!this.isNew || this.Eq_code) return next();

        // increment the counter atomically
        const counter = await Counter.findOneAndUpdate(
            { _id: "equipment" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const code = `${CODE_PREFIX}${String(counter.seq).padStart(PAD, "0")}`;
        this.Eq_code = code;

        next();
    } catch (err) {
        next(err);
    }
});



const Equipment = mongoose.model("Equipment", EquipmentSchema);
export default Equipment; 