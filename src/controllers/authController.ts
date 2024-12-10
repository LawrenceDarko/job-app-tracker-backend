import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';
import { hashPassword } from '../utils/hashPassword';
import validatePassword from '../utils/validatePassword';
import User from '../models/User';
import validator from 'validator';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import nodemailer from 'nodemailer'; 
import { sendEmailNotification } from '../utils/sendEmailNotification';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { passwordResetEmail } from '../constants';

dotenv.config(); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(process.cwd(), 'uploads/userprofiles/');
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filenName = file.originalname.replace(ext, '').split(' ').join('_');
        cb(null, filenName + '_' + Date.now() + ext);
        // cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const userProfile = multer({ storage });

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    // console.log("Heyyyy", username, email, password)

    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    let userImage = null;

    // if (req.file)
    //     userImage = req.file.filename;
    // }

    try {

        if (!validator.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email address' });
            return;
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            // image: userImage,
        });

        const token = generateToken(user._id, user.username);

        const sanitizedUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            // image: user.image,
        };

        res.status(201).json({ success: true, data: sanitizedUser, token, message: 'User created Successfully' });
    } catch (error: any) {
        console.log("ERROR REGISTERING USER", error)
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!validator.isEmail(email)) {
            res.status(400).json({ error: 'Invalid email address' });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await validatePassword(password, user.password);

        // console.log("check ",isValidPassword)

        if (!isValidPassword) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const newUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }

        // const token = generateToken(newUser);
        const token = generateToken(user._id, user.username);

        res.status(200).json({ success: true, data: newUser, token, message: "User Login Successfully" });
    } catch (error) {
        console.log("Hey ",error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    let userProfile = null
        if(req.file) {
            const uploadedImage = req.file
            userProfile = uploadedImage.filename
        }

        // console.log("userProfile", userProfile)

        if(req.file){
            // console.log('file2', req.file)
            const deleteExistingLogo: any = await User.findById(id);
            if(deleteExistingLogo && deleteExistingLogo.image && typeof deleteExistingLogo.image === 'string') {
                fs.unlinkSync(`${process.cwd()}/uploads/userprofiles/${deleteExistingLogo.image}`);
            }
        }

        const checkImage: any = {};
        if(userProfile) {
            checkImage.image = userProfile
        }

    try {
        const updateFields: any = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (password) updateFields.password = await hashPassword(password);

        const updatedUser = await User.findByIdAndUpdate(id, {...updateFields, ...checkImage}, { new: true }).populate('organization role');

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({success: true, data: updatedUser});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    // Invalidate token logic should be here (depends on how token is managed)
    res.status(200).json({ message: 'User logged out successfully' });
};

// Request a password reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set token and expiration on user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        // Send email with reset token
        await sendEmailNotification(user.email, 'Password Reset', passwordResetEmail(resetToken, user), 'Password Reset');

        res.status(200).json({ success: true, message: 'Reset email sent' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find user by reset token and check if token is expired
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }

        // Hash the new password
        const hashedPassword = await hashPassword(password);

        // Update user password and clear reset token and expiration
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

