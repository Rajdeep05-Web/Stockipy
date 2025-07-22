import {User} from '../models/userModel.js';
import jwt from 'jsonwebtoken'; // to generate signed token
import bcrypt from 'bcryptjs'; // to hash password
import mongoose from 'mongoose'; // to check object id
import connectDB from '../DB/index.js'; // to connect to db
import axios from 'axios'; 

const createAccessToken = async (user) => {
    return jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE })  
}

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_SECRET, {
      expiresIn: `${process.env.REFRESH_TOKEN_LIFE}d`,
    });
    return refreshToken;
  };
  const getTokenExpireTime = (token) => {

  }
  
export const signUpUser = async (req, res) => {
    try {
        await connectDB();
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
        await connectDB();
       const {email, password} = req.body;
       //check if email and password are provided
       if(!email || !password){
           return res.status(400).json({ error: "Please fill all the fields" });   
       } 
       //check if user exists in db
       const existUser = await User.findOne({email:{ $eq : email}});
       if(!existUser){
           return res.status(400).json({ error: "User not found" });
        }
        //check if password is correct
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
        existUser.refreshTokenExpire = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000));

        //save user in db
        await existUser.save();

        //send refresh token in cookie for security
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, //cookie is not accessible via client side js (XSS attacks)
            secure : false, //cookie is only sent over https (secure connection)
            maxAge: parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000, //cookie expire
            sameSite: "lax",//cookie is only sent to the same origin as the domain in the address bar
            path: '/', // Accessible across all routes
        })
        //send res body with access token and user details
        return res.status(201).json({user:{_id:existUser._id, email:existUser.email, name:existUser.name, profilePicture:existUser.profilePicture}, token:accessToken, isAuthenticated:existUser.isVerified, message : "User logged in successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const logOutUser = async (req, res) => {
    try {
        await connectDB();
        const {id} = req.params;
        const {email} = req.body;
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid User ID" });
          }
          const ifExist = await User.findById(id);
          if(!ifExist){
            return res.status(400).json({ error: "User not found" });
          }
          const user = await User.findOne({email: { $eq: email }});
            if(!user){
                return res.status(400).json({ error: "User not found" });
            }
            //remove refresh token and set isverified:false from db
            user.refreshToken = "";
            user.refreshTokenExpire = "";
            user.isVerified = false;

            //save user in db
            await user.save();

            //clear cookie
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
          });

          return res.status(200).json({ message: "User Logedout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const googleSignIn = async (req, res) => {
    // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
        await connectDB();
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ error: "No token provided" });
        }
        const token = authHeader.split(' ')[1];
        // Verify the access token
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

        const { email, name, picture, email_verified } = userInfo.data;

        //check if user exists in db
        let user = await User.findOne({ email: { $eq: email } });
        if (!user) {
            //create new user if not exists
            user = new User({
                name: name,
                email: email,
                password: "google-auth", //google auth does not require password
                profilePicture: picture,
                isVerified: email_verified, //google auth is verified by default
            });
            await user.save();
        } else {
            //update user info if exists
            user.name = name;
            user.profilePicture = picture;
            user.isVerified = email_verified; //google auth is verified by default
            await user.save();
        }

        //generate access token
        const accessToken = await createAccessToken(user);

        //generate refresh token
        const refreshToken = await generateRefreshToken(user);

        //save refresh token in db
        user.refreshToken = refreshToken;
        user.refreshTokenExpire = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000));
        
        //save user in db
        await user.save();

        //send refresh token in cookie for security
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, //cookie is not accessible via client side js (XSS attacks)
            secure : false, //cookie is only sent over https (secure connection)
            maxAge: parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000, //cookie expire
            sameSite: "lax",//cookie is only sent to the same origin as the domain in the address bar

        });
        return res.status(201).json({user:{_id:user._id, email:user.email, name:user.name, profilePicture:user.profilePicture}, token:accessToken, isAuthenticated:user.isVerified, message : "User logged in successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const reGenerateAccessToken = async (req, res) => {
  try {
    await connectDB();
     const refreshToken = req.cookies.refreshToken;
    //  console.log("Cookie in regenerate controller",refreshToken);
     if(!refreshToken){
        return res.status(400).json({ error: "Unauthorized: No token provided" });
     }
     //verify refresh token
     const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

     if(!decode?.email){
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
     }
     
     //check if user exists in db
        const user = await User.findOne({email:{ $eq : decode.email}});
        if(!user){
            return res.status(401).json({ error: "User not found" });
        }
        //check if refresh token is valid
        if(user.refreshToken !== refreshToken){
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        //generate new access token
        const accessToken = await createAccessToken(user);
        //send res body with access token and user details
        return res.status(201).json({user:{email:user.email, name:user.name}, token:accessToken, isAuthenticated:user.isVerified, message : "Token refreshed successfully"});
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Refresh token expired. Please log in again." });
  }
};

export const verifyUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1];
    try {
    if(!refreshToken){
        return res.status(400).json({ error: "Unauthorized: No token provided" });
    }
    const refreshDecode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const accessDecode = jwt.verify(accessToken, process.env.JWT_SECRET);

    if(refreshDecode.userId != accessDecode.id){
        return res.status(401).json({error : "Unauthorized token provided"});
    }
    
    return res.status(201).json({message: "User is verified"});
        
    } catch (error) {
        console.log(error);
        if(error.message == "jwt expired"){
            return res.status(401).json({error : "Session expired, log in again" || error.message})
        }
        return res.status(403).json({error: error.message || "Error during User Verification"});
    }
}