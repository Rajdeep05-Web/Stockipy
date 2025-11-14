import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true,
    },
    password : {
        type:String,
        required:true,
    },
    name : {
        type:String,
        required:true,
    },
    token : {
        type:String,
    },
    role : {
        type:String,
        default:"Admin",
    },
    roleId: {
        type: Number,
        default: 0,
    },
    profilePicture :{
        type:String,
        default:"",
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpire: {
        type: Date,
        default: null
    },
    resetPasswordOTP: {
        type: String,
        default: null
    }, 
    resetPasswordOTPExpire: {
        type: Date,
        default: null
    },
    isTwoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
        default: new Date()
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);