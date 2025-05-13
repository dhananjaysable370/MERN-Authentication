import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import transporter from '../nodemailer/nodemailer.js';
import { User } from "../models/auth.model.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from '../nodemailer/emailTemplates.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User already exists!"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const verificationToken = Math.floor(100000 + Math.random() * 900000);
        const verificationTokenExpireAt = Date.now() + 15 * 60 * 1000;

        const user = new User({
            name,
            email,
            password: hash,
            verificationToken,
            verificationTokenExpireAt
        });

        const registeredUser = await user.save();
        if (!registeredUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to create account!"
            });
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: `${user.name} Email verification OTP sent to your email address.`,
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined,
                verificationTokenExpireAt: undefined
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: error.message
        });
    }
};


export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Credentials are required!"
            })
        }

        const user = await User.findOne({
            verificationToken: otp,
            verificationTokenExpireAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or Expired OTP!"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        await user.save();


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Welcome to MERN-Auth",
            html: WELCOME_EMAIL_TEMPLATE.replace("[Customer Name]", user.name).replace("COMPANY", "MERN-Auth").replace("[COMPANY]", "MERN-Auth"),
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
}


export const sendPasswordResetToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email!"
            });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Password reset request sent to your email."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required."
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired reset token."
            });
        }

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset successful.",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const cookie_options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            secure: process.env.NODE_ENV === 'production'
        };

        return res.cookie('access_token', token, cookie_options).status(200).json({
            success: true,
            message: `Welcome back, ${user.name}.`,
            user: {
                ...user._doc,
                password: undefined,
                token: token
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const cookie_options = {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            secure: process.env.NODE_ENV === 'production'
        }
        return res.clearCookie('access_token', cookie_options).status(200).json({
            success: true,
            message: "Logged out successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid id!"
            })
        }
        const user = await User.findById(id).select("-password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User authenticated.",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
}