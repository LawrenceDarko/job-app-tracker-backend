import { Router } from 'express';
import { register, login, getAllUsers, getAUser, deleteAUser, logoutUser, updateUser, requestPasswordReset, resetPassword } from '../controllers/authController';
import protect from '../middleware/authMiddleware';
// import processImage from '../middleware/processImages';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logoutUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.get('/users', protect, getAllUsers);
router.get('/users/:id', protect, getAUser);
router.patch('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteAUser);

export default router;
