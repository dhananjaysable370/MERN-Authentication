
export const sendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Please enter valid email!"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetPasswordToken = otp;
        user.resetPasswordExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset otp",
            text: `Your password reset otp is ${otp}`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error
        })
    }
}

export const verifyPasswordResetOtp = async (req, res) => {
    try {
        const { newPassword, otp } = req.body;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Credentials required!"
            })
        }
        const user = await User.findOne({
            resetPasswordToken: otp,
            resetPasswordExpireAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP!"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);


        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpireAt = undefined;

        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Successfully reset password.",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error
        })
    }
}