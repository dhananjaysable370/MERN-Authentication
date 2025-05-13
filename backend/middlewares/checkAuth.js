import jwt from 'jsonwebtoken';

export const checkAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id
        };

        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? "Token has expired!"
            : "Invalid token!";

        return res.status(401).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

