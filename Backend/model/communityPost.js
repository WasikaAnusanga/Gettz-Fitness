import mongoose from 'mongoose';
import './user.js';
import generateID from "../utils/idGenerator.js";

const communityPostSchema = new mongoose.Schema(
  {
    postID:{
      type : String,
      required : true,
      unique : true,
      default : function () {
        return "ComPost" + generateID()
      }
    },

    title: { 
      type: String, 
      required: true, 
      trim: true 
    },

    content: { 
      type: String, 
      required: true,
      default: '' 
    },

    imageURL: { 
      type: String, 
      default: '' 
    },

    postDate: { 
      type: Date, 
      default: Date.now,
      required: true,
    },

    postBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }
  },
  { timestamps: true }
);

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;