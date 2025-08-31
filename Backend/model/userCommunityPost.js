import mongoose from 'mongoose';
import './communityPost';
import './user';

const userCommunityPostSchema = new mongoose.Schema(
  {
    postID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'CommunityPost', 
      required: true, 
      index: true 
    },

    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    }
  },
  { timestamps: true }
);

const UserCommunityPost = mongoose.model('UserCommunityPost', userCommunityPostSchema);
export default UserCommunityPost;