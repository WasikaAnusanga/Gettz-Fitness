import mongoose from "mongoose";
import generateID from "../utils/idGenerator.js";

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    unique: true,
    default : function () {
      return "video" + generateID()
    }
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
  category:{
    type: String,
    required: true
  }
  ,
  duration: {
    type: Number, 
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  workOutStep:{
    type:[String],
    default:[]
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
  },
   likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }]
})


const Video = mongoose.model("Video", videoSchema);
export default Video;
