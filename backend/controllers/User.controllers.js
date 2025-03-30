import joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js'
import dotenv from 'dotenv';

dotenv.config()

export const signupUser = async (req, res) => {
    console.log("Request Body:", req.body);
    const { userName, userEmail, userPassword } = req.body;

    try {
        const existingUser = await User.findOne({ userEmail });
        console.log("Existing user: ", existingUser);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = new User({ userName, userEmail, userPassword: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        console.log("User registered successfully");
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { userId: newUser._id, token }
        });

    } catch (e) {
        console.error("Server Error:", e);
        return res.status(500).json({
            error: true,
            message: "Server error",
            details: e.message
        });
    }
};

export const loginUser = async (req, res) => {
    console.log("Request Body:", req.body);
    
    try {
        const { userEmail, userPassword } = req.body;
        const user = await User.findOne({ userEmail });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordMatch) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        res.status(200).json({
            userName: user.userName,
            success: true,
            message: "User logged in successfully", 
            data: { userId: user._id, token } 
        });
    } catch (e) {
        return res.status(e.statusCode || 500).json({
            error: true,
            message: e.message,
        });
    }
}