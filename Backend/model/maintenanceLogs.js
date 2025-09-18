import mongoose from  "mongoose";
const schema = mongoose.Schema;

//maintenance log schema
const MaintenanceLogSchema = new schema({
    M_Eq_name:{
        type:String,
        required:true
    },
    M_description:{
        type:String,
        required:true
    },
    M_logType:{
        type:String,
        enum:['Repair','Inspection','Service'],
        required:true,
        default:'Inspection'
    },
    M_date:{
        type:Date,
        default:Date.now,
        required:true
    },
    Eq_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Equipment',
        required:true
    }
});

const MaintenanceLog= mongoose.model("MaintenanceLog",MaintenanceLogSchema);
export default MaintenanceLog;