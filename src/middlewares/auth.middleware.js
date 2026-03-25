const jwtToken = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.redirect(`/login?error=Debes iniciar sesión&redirect=${req.originalUrl}`);
    }
    const decoded = jwtToken.verifyToken(token);
    if (!decoded) {
      return res.redirect(`/login?error=Sesión inválida&redirect=${req.originalUrl}`);
    }
    req.user = decoded;
    console.log(req.user)
    res.locals.user = req.user || null;
    next();
  } catch (error) {
    return res.redirect(`/login?error=Error de autenticación`);
  }
};

const authLevel = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(`/login?error=No autenticado`);
      }
      if (!roles.includes(user.role)) {
        return res.redirect(`/login?error=No autorizado`);
      }
      next();
    } catch (error) {
      return res.redirect(`/login?error=Error de autorización`);
    }
  };
};

module.exports = { authMiddleware, authLevel };