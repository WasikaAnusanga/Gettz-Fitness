import mongoose from 'mongoose';
const schema = mongoose.Schema;

//purchase schema
const purchaseSchema = new schema({
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
    P_item:{
        type: String,
        enum:['Equipment','Supplement','Other'],
        default:'Other',
        required:true
    },
    P_note:{ 
        type: String,
        default:'No notes'
    },
});

const purchase= mongoose.model("purchase",purchaseSchema);
export default purchase;