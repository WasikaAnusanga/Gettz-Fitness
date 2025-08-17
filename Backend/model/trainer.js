import mongoose from 'mongoose' ;
import Counter from './counter.js';

const trainerSchema = new mongoose.Schema({
    trainerId:{
        type: String,
        unique: true
    },
     name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
     phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePicture: { 
        type: String
    },
    role: {
        type: String,
        default: 'trainer'
    },
    certifications:{
        type: [String],
        default: []
    },
    experienceYears:{
        type: Number,
        default: 0
    },
    specialization:{
        type: String,
        enum: ['General Fitness', 'Weight Loss', 'Muscle Gain', 'Nutrition', 'Yoga', 'Pilates'],
        default: 'General Fitness'
    },
    rating:{
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews:[{
        member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: { type: Number, min: 1, max: 5 }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isDisabled :{
        type : Boolean,
        default : false,
        required : true
    },
    createdAt: {
    type: Date,
    default: Date.now
    },
    updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin:{
    type: Date
  },

})
trainerSchema.pre("save",async function(next){
    if(this.isNew){
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'trainerId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.trainerId = `trainer ${counter.seq}`;
    }
    next();
})
const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;