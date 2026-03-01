const passport = require("passport");
const { generateToken } = require("../utils/tokens");
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
  res.json({
    status: "success",
    user: req.user
  });
};

module.exports = {
  login,
  current
};