import jwt from 'jsonwebtoken'
export const checkAuth = async (req, res, next) => {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            return res.status(401).json({
                success: false,
                message: "Token is required!"
            })
        }

        const decodeToken = jwt.verify(access_token, process.env.JWT_SECRET)

        if (!decodeToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token!"
            })
        }

        req.user = {
            id: decodeToken?.id
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error.message
        });
    }
}