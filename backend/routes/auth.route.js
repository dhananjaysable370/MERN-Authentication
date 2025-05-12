import express from 'express';
import {
    getUser,
    login,
    logout,
    register,
    resetPassword,
    sendPasswordResetToken,
    verifyEmail
} from '../controllers/auth.controller.js';

import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

// Protected route to get authenticated user
router.get('/check-auth', checkAuth, getUser);

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Email verification
router.post('/verify-email', verifyEmail);

// Password reset flow
router.post('/forgot-password', sendPasswordResetToken);
router.post('/reset-password/:token', resetPassword);

export default router;
