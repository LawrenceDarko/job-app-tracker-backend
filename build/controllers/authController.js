"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.logoutUser = exports.deleteAUser = exports.updateUser = exports.getAUser = exports.getAllUsers = exports.login = exports.register = exports.userProfile = void 0;
const generateToken_1 = require("../utils/generateToken");
const hashPassword_1 = require("../utils/hashPassword");
const validatePassword_1 = __importDefault(require("../utils/validatePassword"));
const User_1 = __importDefault(require("../models/User"));
const validator_1 = __importDefault(require("validator"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path_1.default.join(process.cwd(), 'uploads/userprofiles/');
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const filenName = file.originalname.replace(ext, '').split(' ').join('_');
        cb(null, filenName + '_' + Date.now() + ext);
        // cb(null, Date.now() + path.extname(file.originalname));
    },
});
exports.userProfile = (0, multer_1.default)({ storage });
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    let userImage = null;
    // if (req.file)
    //     userImage = req.file.filename;
    // }
    try {
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email address' });
            return;
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const user = yield User_1.default.create({
            username,
            email,
            password: hashedPassword,
            // image: userImage,
        });
        const token = (0, generateToken_1.generateToken)(user._id, user.username);
        const sanitizedUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            // image: user.image,
        };
        res.status(201).json({ success: true, data: sanitizedUser, token, message: 'User created Successfully' });
    }
    catch (error) {
        console.log("ERROR REGISTERING USER", error);
        res.status(500).json({ message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ error: 'Invalid email address' });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const isValidPassword = yield (0, validatePassword_1.default)(password, user.password);
        // console.log("check ",isValidPassword)
        if (!isValidPassword) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const newUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        // const token = generateToken(newUser);
        const token = (0, generateToken_1.generateToken)(user._id, user.username);
        res.status(200).json({ success: true, data: newUser, token, message: "User Login Successfully" });
    }
    catch (error) {
        console.log("Hey ", error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('-password').populate('organization role').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id).select('-password').populate('organization').populate('role');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAUser = getAUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, email, password } = req.body;
    let userProfile = null;
    if (req.file) {
        const uploadedImage = req.file;
        userProfile = uploadedImage.filename;
    }
    // console.log("userProfile", userProfile)
    if (req.file) {
        // console.log('file2', req.file)
        const deleteExistingLogo = yield User_1.default.findById(id);
        if (deleteExistingLogo && deleteExistingLogo.image && typeof deleteExistingLogo.image === 'string') {
            fs_1.default.unlinkSync(`${process.cwd()}/uploads/userprofiles/${deleteExistingLogo.image}`);
        }
    }
    const checkImage = {};
    if (userProfile) {
        checkImage.image = userProfile;
    }
    try {
        const updateFields = {};
        if (username)
            updateFields.username = username;
        if (email)
            updateFields.email = email;
        if (password)
            updateFields.password = yield (0, hashPassword_1.hashPassword)(password);
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateFields), checkImage), { new: true }).populate('organization role');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUser = updateUser;
const deleteAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAUser = deleteAUser;
const logoutUser = (req, res) => {
    // Invalidate token logic should be here (depends on how token is managed)
    res.status(200).json({ message: 'User logged out successfully' });
};
exports.logoutUser = logoutUser;
// Request a password reset
// export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { email } = req.body;
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             res.status(400).json({ message: 'User not found' });
//             return;
//         }
//         // Generate a reset token
//         const resetToken = crypto.randomBytes(20).toString('hex');
//         // Set token and expiration on user document
//         user.resetPasswordToken = resetToken;
//         user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
//         await user.save();
//         // Send email with reset token
//         await sendEmailNotification(user.email, 'Password Reset', passwordResetEmail(resetToken, user), 'Password Reset');
//         res.status(200).json({ success: true, message: 'Reset email sent' });
//     } catch (err: any) {
//         res.status(500).json({ message: err.message });
//     }
// };
// Reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // Find user by reset token and check if token is expired
        const user = yield User_1.default.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }
        // Hash the new password
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        // Update user password and clear reset token and expiration
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        res.status(200).json({ success: true, message: 'Password reset successful' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.resetPassword = resetPassword;
