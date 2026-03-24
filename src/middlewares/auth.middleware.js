const { verifyToken } = require("../utils/jwt");

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
      return res.redirect("/login?error=Debes iniciar sesión");
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.redirect("/login?error=Token inválido");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login?error=Error de autenticación");
  }
};

const handleUnauthorized = (req, res, message) => {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect(`/login?error=${encodeURIComponent(message)}`);
  }
  return res.status(401).json({ error: message });
};

module.exports = authMiddleware;
