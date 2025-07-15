//make an logic to create a new user(register)
import {User} from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import { deleteMedia, uploadMedia } from '../utils/cloudinary.js';

export const register = async (req, res) => {
    try {
        //get from frontend
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }
        //check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
            });
        }
        //else create a new user
        //use bcrypt to hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(200).json({
            success: true,
            msg: "User created successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to register user"
        });
    }
}
//make an logic to login a user
export const login = async (req, res) => {
    try {
        //get from frontend
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect email or password"
            });
        }
        //check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect email or password"
            });
        }
        //authentication
        generateToken(res,user,`Welcome back ${user.name}`);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to login user"
        });
    }
}

//logout logic
export const logout = async (req, res) => {
    try {
        //remove token from cookie
        return res.status(200).cookie('token',"", {maxAge:0}).json({
            success: true,
            msg: "Logged out successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to logout"
        });
    }
}
//get user profile
//user profile only accessible if user is logged in so for that we need to create a middleware on another file.

export const getUserProfile = async (req, res) => {
    try {
       //get user id from req object
       const userId=req.id;
       //cannot get password from user
       const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "Profile not found"
            });
        }
        //return user profile
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to get user profile"
        });
    }
}
//for update user profile photo
export const updateProfile = async (req, res) => {
    try {
        //get user id from req object
        const userId=req.id;
        const {name}=req.body;
        const profilePhoto=req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }
        //update user profile photo
        //Use cloundinary to store image
        //its gives a public url of image that can use to display image.
        //extract public id of the old image from the url  if it exist.
        if(user.photoUrl){
            const publicId=user.photoUrl.split("/").pop().split(".")[0]; //extract public id from url
            deleteMedia(publicId);
        }
        //upload new image
        const cloudResponse=await uploadMedia(profilePhoto.path);//return an url
        //get photourl from cloudResponse
        const photoUrl=cloudResponse.secure_url;

        const updatedData={name,photoUrl}
        const updatedUser=await User
        .findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "User Profile updated successfully"
        });
        
        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to update user profile"
        });
    }

}

