const passport = require("passport");
const { generateToken } = require("../utils/tokens");
const UserDTO = require("../dto/user.dto");

const login = (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Credenciales inválidas"
      });
    }
    const token = generateToken(user);
    return res.json({
      status: "success",
      access_token: token
    });
  })(req, res, next);
};

const current = (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json({
    status: "success",
    user: userDTO
  });
};

module.exports = {
  login,
  current
};