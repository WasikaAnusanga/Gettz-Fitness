import mongoose from 'mongoose';
const schema = mongoose.Schema;

//supplement schema
const supplementSchema = new schema({
    Sup_ID:{
        type:String,
        required: true,
        unique: true
    },
    Sup_name:{
        type:String,
        required:true
    },
    Sup_type:{
        type: String,
        required: true
    },
    Sup_price:{
        type: Number,
        required: true
    },
    Sup_status:{
        type: String,
        enum:['In stock','Out of stock'],
        default: 'IN stock',
        required: true
    },
    Sup_quantity:{
        type: Number,
        required: true
    },
    Sup_supplier:{
        type: String
    },
    IM_ID:{
        type: mongoose.Schema.Types.ObjectId,
        reg: 'equipmentManager',
        required: true
    }
});

const supplement= mongoose.model("supplement",supplementSchema);
export default supplement;