import mongoose from "mongoose";
const { Schema } = mongoose;


//purchase schema
const purchaseSchema = new Schema({
    P_code: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    P_date: {
        type: Date,
        required: true
    },
    P_cost: {
        type: Number,
        required: true,
        min:0
    },
    P_quantiy: {
        type: Number,
        required: true,
        min:1
    },
    P_item: {
        type: String,
        enum: ['Equipment', 'Supplement', 'Other'],
        default: 'Other',
        required: true
    },
    P_note: {
        type: String,
        default: 'No notes'
    },
});


const purchase = mongoose.model("purchase", purchaseSchema);
export default purchase;