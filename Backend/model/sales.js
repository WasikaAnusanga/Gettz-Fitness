import mongoose from 'mongoose';
const schema = mongoose.Schema;

//sales schema
const salesSchema = new schema({
    Sa_ID:{
        type: String,
        required: true,
        unique: true
    },
    Sa_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    Sa_amount:{
        type: Number,
        required: true
    },
    Sa_quantity:{
        type: Number,
        required: true
    },
    Sup_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplement',
        required: true
    },
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const sales= mongoose.model("sales",salesSchema);
export default sales;