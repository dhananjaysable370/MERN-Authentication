import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import transporter from '../mailtrap/nodemailer.js';
import { User } from "../models/auth.model.js";
import { VERIFICATION_EMAIL_TEMPLATE } from '../mailtrap/emailTemplates.js';

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

        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const cookie_options = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            secure: process.env.NODE_ENV === 'production'
        };

        return res.cookie('access_token', token, cookie_options).status(201).json({
            success: true,
            message: `${user.name} registered successfully.`,
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
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Credentials are required!"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!"
            })
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials!"
            })
        }

        const cookie_options = {
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            secure: process.env.NODE_ENV === 'production'
        }

        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.cookie('access_token', token, cookie_options).status(200).json({
            success: true,
            message: `Welcome ${user.name}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error
        })
    }
}
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
            error
        })
    }
}