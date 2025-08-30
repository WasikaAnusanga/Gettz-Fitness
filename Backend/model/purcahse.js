import mongoose from 'mongoose';
const schema = mongoose.Schema;

//purchase schema
const purchaseSchema = new schema({
    P_ID:{
        type: String,
        required: true,
        unique: true
    },
    P_date:{
        type: Date,
        required: true
    },
    P_cost:{
        type: Number,
        required: true
    },
    P_quantiy:{
        type: Number,
        required: true
    },
    Eq_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required : true
    },
    Sup_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplement',
        required : true

    }
});

const purchase= mongoose.model("purchase",purchaseSchema);
export default purchase;