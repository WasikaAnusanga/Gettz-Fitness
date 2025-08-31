import mongoose from 'mongoose';
import './user.js';
import './notification.js';

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

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
export default UserNotification;