const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = authMiddleware;
