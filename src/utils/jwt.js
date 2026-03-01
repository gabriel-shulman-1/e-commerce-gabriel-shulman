const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
module.exports = {
    generateToken,
    verifyToken
};