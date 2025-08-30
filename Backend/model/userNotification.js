import mongoose from 'mongoose';
import './user';
import './notification';

const userNotificationSchema = new mongoose.Schema(
  {
    NIC: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Notification', 
      required: true
    },
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    }
  },
  { timestamps: true }
);

const UserChallenge = mongoose.model('UserChallenge', userNotificationSchema);
export default UserChallenge;