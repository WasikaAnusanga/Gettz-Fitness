import mongoose, { Schema } from "mongoose";
import './user.js'

const leaderboardSchema = new mongoose.Schema({
  LID: { type : String, required : true, unique : true,
    default : function () {
      return "LB" + generateID()
    }
  },

  points: { 
    type: Number, 
    required: true, 
    default: 0 
  },

  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  }
}, 

{ timestamps: true }
);


const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard 