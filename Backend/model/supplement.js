import mongoose from 'mongoose';
const {Schema} = mongoose;


//supplement schema
const supplementSchema = new Schema({
    Sup_code:{
        type:Number,
        unique:true,
        required:true,
        trim:true
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
        required: true,
        min:0
    },
    Sup_status:{
        type: String,
        enum:['In stock','Out of stock'],
        default: 'IN stock',
        required: true
    },
    Sup_quantity:{
        type: Number,
        required: true,
        min:1
    },
    Sup_supplier:{
        type: String
    },
    IM_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'equipmentManager',
        required: true
    },
    Sup_image:[],  

});


const supplement= mongoose.model("supplement",supplementSchema);
export default supplement;