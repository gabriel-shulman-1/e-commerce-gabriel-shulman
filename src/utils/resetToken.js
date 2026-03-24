const jwt = require("jsonwebtoken");
const generateResetToken = (user) => {
    return jwt.sing({id: user._id}, process.env.JWT_SECRET,{ expiresIn: "1h"});
};
module.exports = {generateResetToken};