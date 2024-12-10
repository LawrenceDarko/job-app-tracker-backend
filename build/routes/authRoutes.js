"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
// import processImage from '../middleware/processImages';
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/logout', authMiddleware_1.default, authController_1.logoutUser);
router.get('/users', authMiddleware_1.default, authController_1.getAllUsers);
router.get('/users/:id', authMiddleware_1.default, authController_1.getAUser);
router.patch('/users/:id', authMiddleware_1.default, authController_1.updateUser);
router.delete('/users/:id', authMiddleware_1.default, authController_1.deleteAUser);
exports.default = router;
