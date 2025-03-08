import { response } from 'express';
import {User} from '../models/userModel.js';
import jwt from 'jsonwebtoken'; // to generate signed token
import bcrypt from 'bcryptjs'; // to hash password

const createAccessToken = async (user) => {
    return jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE })  
}

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    });
    return refreshToken;
  };
  
export const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const existUser = await User.findOne({email:{ $eq : email}});
        if(existUser){
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return res.status(201).json({message : "User created successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const logInUser = async (req, res) => {
    try {
       const {email, password} = req.body;
       const existUser = await User.findOne({email:{ $eq : email}});
       if(!existUser){
           return res.status(400).json({ error: "User not found" });
        }
        const ismatchPassword = await bcrypt.compare(password, existUser.password);
        if(!ismatchPassword){
            return res.status(400).json({ error: "Invalid credentials" });
        }
        //access token for api calls
        const accessToken = await createAccessToken(existUser);
        //refresh token for login logout
        const refreshToken = await generateRefreshToken(existUser);
        //save refresh token in db
        existUser.isVerified = true;
        existUser.refreshToken = refreshToken;
        existUser.refreshTokenExpire = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        await existUser.save();
        return res.status(201).json({user:{email:existUser.email, name:existUser.name}, token:accessToken, isAuthenticated:existUser.isVerified, message : "User logged in successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const logOutUser = async (req, res) => {
    try {
       
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};