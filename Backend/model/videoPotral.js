import mongoose from 'mongoose';

const videoPotarlSchema = new mongoose.Schema({

    videoId:{
        type:String,
        unique:true,
        rquired:true
    },
    tittle:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true
    },
    viewCount:{
        type:Number,
        default:0
    },
    uploaderId: {
        type:mongoose.Schema.Types.ObjectId ,
        ref:'trainer',
        required: true
    },


})
const VideoPortal = mongoose.model('VideoPortal', videoPotarlSchema);
export default VideoPortal;
