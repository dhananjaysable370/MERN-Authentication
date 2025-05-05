import express from 'express'
import { login, logout, register, resetPassword, sendPasswordResetToken, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', sendPasswordResetToken);
router.post('/reset-password/:token', resetPassword);

export default router;