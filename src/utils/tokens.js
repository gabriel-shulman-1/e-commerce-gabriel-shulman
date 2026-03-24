const jwt = require("jsonwebtoken");
const tokenUtil = {
    generateToken: (user) => {
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    },
    generateResetToken: (user) => {
        return jwt.sign({id: user._id}, process.env.JWT_SECRET,{ expiresIn: "1h"});
    }

}
module.exports = tokenUtil;