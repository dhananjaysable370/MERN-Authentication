import express from 'express'
import { login, logout, register, sendPasswordResetOtp, verifyEmail, verifyPasswordResetOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/send-password-reset-otp', sendPasswordResetOtp);
router.post('/verify-password-reset-otp', verifyPasswordResetOtp);

export default router;