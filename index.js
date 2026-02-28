require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const productSocket = require("./src/sockets/products.sockets.js");
const cartSocket = require("./src/sockets/cart.sockets.js");
const app = express();
const PORT = process.env.PORT || 8080;
const passport = require("passport");
const initializePassport = require("./src/config/passport.config");

// HTTP + Socket
const server = http.createServer(app);
const io = new Server(server);
console.log("Inicializando Passport...", process.env.JWT_SECRET,process.env.MONGO_DB_PASSWORD);
mongoose
.connect(
  `mongodb+srv://gesover_db_user:${process.env.MONGO_DB_PASSWORD}@cluster0.m9sroh3.mongodb.net/?appName=Cluster0`,
)
.then(() => {
  console.log("conectado a Mongo Atlas");
})
.catch((error) => {
  console.log("No se pudo conectar");
});
// middlewares
app.use(express.json());

// archivos estáticos
app.use(express.static(path.join(__dirname, "src", "public")));

// handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src", "views", "layouts"),
    partialsDir: path.join(__dirname, "src", "views", "partials"),
    helpers: {
      increment: (v) => v + 1,
      decrement: (v) => v - 1,
      gt: (a, b) => a > b,
      lt: (a, b) => a < b,
      eq: (a, b) => a === b,
    },
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));
app.use(
  "/bootstrap-icons",
  express.static(path.join(__dirname, "node_modules", "bootstrap-icons")),
);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// rutas HTTP

initializePassport();
app.use(passport.initialize());
const products = require("./src/routes/products.routes");
const cart = require("./src/routes/cart.routes");
const views = require("./src/routes/views.routes");
const authRoutes = require("./src/routes/auth.routes");
const sessionsRoutes = require("./src/routes/sessions.routes");

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/cart", cart);
app.use("/api/products", products);
app.use("/", views);
io.on("connection", (socket) => {
  productSocket(io, socket);
  cartSocket(io, socket);
});

// server
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
