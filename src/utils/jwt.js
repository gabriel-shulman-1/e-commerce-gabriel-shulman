const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET_KEY,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        return null;
    }
};
module.exports = {
    generateToken,
    verifyToken
};