import mongoose from 'mongoose';
import validator from 'validator';

const adminSchema = new mongoose.Schema({
    adminId:{
        type: String,
        unique: true
    },
    email:{
        type :String,
        required : [true, 'Please provide Valid email'],
        unique :true,
        validate:[validator.isEmail, 'Please provide a valid email'],
        trim : true,
        lowercase : true
    },
    firstName:{
        type :String,
        required : true
    },
    lastName:{
        type :String,
        required : true
    },
    password:{
        type :String,
        required : [true, 'Please provide a password'],
        minlength : 8,
    },
    phone:{
        type :String,
        required : true,
        default : "Not given"

    },
    profilePicture: {
    type: String,
    default: 'default-profile.jpg'
    },
    role:{
        type :String,
        required : true,
        default : "admin"
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

});
const Admin = new mongoose.model('Admin', adminSchema);
export default Admin;

