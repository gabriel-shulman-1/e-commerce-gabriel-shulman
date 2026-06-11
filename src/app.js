const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config");
const products = require("./routes/products.routes");
const cart = require("./routes/cart.routes");
const authRoutes = require("./routes/auth.routes");
const sessionsRoutes = require("./routes/sessions.routes");
const viewsRoutes = require("./routes/views.routes");

function createApp() {
  const app = express();
  // Middlewares básicos
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Mock seguro para Socket.IO durante tests
  app.use((req, res, next) => {
    req.io = req.app.get("io") || {
      emit: () => {},
    };
    next();
  });
  // Passport
  initializePassport();
  app.use(passport.initialize());
  // Rutas API
  app.use("/api/auth", authRoutes);
  app.use("/api/sessions", sessionsRoutes);
  app.use("/api/cart", cart);
  app.use("/api/products", products);
  // Views
  app.use("/", viewsRoutes);
  // Health check (útil para Docker y tests)
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "ecommerce-api",
    });
  });
  // Ruta inexistente
  app.use((req, res) => {
    res.status(404).json({
      error: "Ruta no encontrada",
    });
  });
  // Middleware global de errores
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || "Error interno del servidor",
    });
  });
  return app;
}

module.exports = {
  createApp,
};