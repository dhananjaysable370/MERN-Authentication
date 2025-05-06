import express from 'express'
import { getUser, login, logout, register, resetPassword, sendPasswordResetToken, verifyEmail } from '../controllers/auth.controller.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.get("/check-auth", checkAuth, getUser);
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', sendPasswordResetToken);
router.post('/reset-password/:token', resetPassword);

export default router;