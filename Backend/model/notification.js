import mongoose from 'mongoose';
import './admin.js'

const notificationSchema = new mongoose.Schema(
{
    title: { 
      type: String, 
      required: true 
    },

    body: { 
      type: String, 
      required: true 
    },

    type: { 
      type: String, 
      required: true, 
      default: 'info' 
    },

    status: { 
      type: String, 
      default: 'queued' 
    },

    deliveryTo: { 
      type: String, 
      default: 'all' 
    },
    sentDate: { 
      type: Date 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin', 
      required: true
    }
},
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;