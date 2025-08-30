import mongoose from 'mongoose';
const schema = mongoose.Schema;

//use schema
const useSchema = new schema({
    Eq_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'equipment',
        required: true
    },
    User_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    U_startTime:{
        type: Date,
        required: true
    },
    U_endTime:{
        type: Date,
        required: true
    }
});

const use= mongoose.model("use",useSchema);
export default use;