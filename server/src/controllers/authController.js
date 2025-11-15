import {User} from '../models/userModel.js';
import jwt from 'jsonwebtoken'; // to generate signed token
import bcrypt from 'bcryptjs'; // to hash password
import mongoose from 'mongoose'; // to check object id
import connectDB from '../DB/index.js'; // to connect to db
import axios from 'axios'; 
import nodemailer from 'nodemailer'; // to send email

const roleObj = {
    0 : "Admin",
    1 : "User"
}

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
       const {email, password, roleId} = req.body;
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
        existUser.lastLogin = new Date();

        //role
        existUser.role = (!roleId ? "Admin" : roleObj[roleId]);

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
        return res.status(201).json({user: {
            _id: existUser._id, 
            email: existUser.email,
            name: existUser.name,
            profilePicture: existUser.profilePicture,
            lastLogin: existUser.lastLogin,
            createdAt: existUser.createdAt,
            role: existUser.role,
            isEmailVerified: existUser.isEmailVerified
            }, token:accessToken, isAuthenticated:existUser.isVerified, message : "User logged in successfully"});
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
        const {roleId} = req.body;
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
                isEmailVerified: email_verified
            });
            await user.save();
        } else {
            //update user info if exists
            user.name = name;
            user.profilePicture = picture;
            user.isVerified = email_verified; //google auth is verified by default
            user.isEmailVerified = email_verified,
            user.password = "google-auth" //for cases when normal signin email converts to google auth email
            await user.save();
        }
        
        //generate access token
        const accessToken = await createAccessToken(user);
        
        //generate refresh token
        const refreshToken = await generateRefreshToken(user);
        
        //save refresh token in db
        user.refreshToken = refreshToken;
        user.refreshTokenExpire = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000));
        user.lastLogin = new Date();

        //role
        user.role = (!roleId ? "Admin" : roleObj[roleId]);
        
        //save user in db
        await user.save();

        //send refresh token in cookie for security
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, //cookie is not accessible via client side js (XSS attacks)
            secure : false, //cookie is only sent over https (secure connection)
            maxAge: parseInt(process.env.REFRESH_TOKEN_LIFE) * 24 * 60 * 60 * 1000, //cookie expire
            sameSite: "lax",//cookie is only sent to the same origin as the domain in the address bar

        });
        return res.status(201).json({user:{
            _id: user._id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            role: user.role,
            isEmailVerified: user.isEmailVerified
        }, token:accessToken, isAuthenticated:user.isVerified, message : "User logged in successfully"});

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

export const forgetPassword = async (req, res) => {
 const {email} = req.body;
 if(!email){
    return res.status(400).json({ error: "Please provide an email" });
 }
 try {
    await connectDB();
    const user = await User.findOne({email: { $eq: email }});
    if(!user){
        return res.status(404).json({ error: "User not found" });
    }
    if(user.password === "google-auth") {
        return res.status(400).json({ error: "This account is linked to Google. Please use Google sign-in to access your account." });
    }
    
    // Generate OTP and set expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await user.save();

    const sendOTPdata = {
        email: user.email,
        otp: otp,
        subject: 'Your OTP Code to Reset Stockipy App Password',
        textMsg: `Your OTP code is ${otp}. It will expire in 10 minute.`,
    }

    await sendOtpToMail(sendOTPdata);

    return res.status(200).json({
      message: "We have sent a verification code to your email. Code is valid for 10 minutes.",
      // In development only:
    //   otp: otp
    });

 } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to send otp" || error.message });
 }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER2,
    pass: process.env.APP_GMAIL_PASSWORD2, 
  },
});

const sendOtpToMail = async (sendOTPdata) => {
  const mailOptions = {
    from: process.env.GMAIL_USER2,
    to: sendOTPdata.email,
    subject: sendOTPdata.subject,
    text: sendOTPdata.textMsg
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "Please provide email and OTP" });
    }
    try {
        await connectDB();
        const user = await User.findOne({ email: { $eq: email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.resetPasswordOTP  || user.resetPasswordOTP !== otp || !user.resetPasswordOTPExpire || user.resetPasswordOTPExpire < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        //clear otp data if success
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpire = null;

        //email verified if OTP success
        user.isEmailVerified = true;

        await user.save();

        return res.status(200).json({ isEmailVerified: user.isEmailVerified , message: "OTP verified successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}

export const resetPassword = async (req, res) => {
    const { email, newPassword, otp } = req.body;
    if(!email || !newPassword || !otp){
        return res.status(400).json({ error: "Please provide email, new password and OTP" });
    }
    try {
        await connectDB();
        const user = await User.findOne({ email: { $eq: email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(user.password === "google-auth") {
        return res.status(400).json({ error: "This account is linked to Google. Please use Google sign-in to access your account." });
        }
        if(user.resetPasswordOTP != otp || !user.resetPasswordOTPExpire || user.resetPasswordOTPExpire < new Date()){
            return res.status(400).json({ error: "Invalid or expired OTP, try again" });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpire = null;
        user.refreshToken = null;
        user.refreshTokenExpire = null;
        user.isVerified = false;
        await user.save();
        
        res.status(200).json({ message: "Password reset successfully" });

        //send a confirmation email to the user
       const mailOptions = {
        from: process.env.GMAIL_USER2,
        to:email,
        subject: 'Your Stockipy App Password is changed',
        text: `It is a confirmation mail to inform you that your stockipy password is changed.`,
       }
       const info = await transporter.sendMail(mailOptions);
       console.log('Email sent: ' + info.response);

       return;

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}