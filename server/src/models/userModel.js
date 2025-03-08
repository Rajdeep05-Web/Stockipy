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
        default:"user",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpire: {
        type: Date,
        default: null
    }
});

export const User = mongoose.model("User", userSchema);