import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const employeeSalarayRecordsSchema = new Schema ({

    record_id:{
        type: Number,
        unique: true,
        required: true,
    },

    workshift_schedule:{
        type: String
    },

    attendance_count:{
        type: Number
    },

    leave_count:{
        type: Number
    },

    performance_notes:{
        type: String
    },

});

const employeeRecords = mongoose.model("employeeSalarayRecords", employeeSalarayRecordsSchema);
export default employeeRecords;