import mongoose from "mongoose";
import Counter from './counter.js';

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  altNames: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  duration: {
    type: Number, 
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})
videoSchema.pre("save",async function(next){
  if(this.isNew){
    const counter = await Counter.findByIdAndUpdate(
      {_id:'videoId'},
      {$inc:{ seq:1 }},
      {new : true, upsert:true}

    );
    this.videoId = `VID0${counter.seq}`;
  }
  next()
});



const Video = mongoose.model("Video", videoSchema);
export default Video;
