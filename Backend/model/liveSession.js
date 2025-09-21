import mongoose from 'mongoose';
import generateID from "../utils/idGenerator.js";
const liveSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true ,
        default : function () {
      return "Live" + generateID()
    }
    },
    title: { type: String, required: true },
    description: { type: String },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    scheduledTime: { type: Date, required: true },
    duration: { type: Number, required: true }, 
    maxParticipants: { type: Number, default: 100 },
    sessionLink: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const LiveSession = mongoose.model('LiveSession', liveSessionSchema);
export default LiveSession;
