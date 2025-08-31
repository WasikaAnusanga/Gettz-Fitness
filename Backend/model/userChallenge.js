import mongoose from 'mongoose';
import './user';
import './communityPost';

const userChallengeSchema = new mongoose.Schema(
  {
    CID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Challenge', required: true
    },

    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }
  },
  { timestamps: true }
);

const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);
export default UserChallenge;