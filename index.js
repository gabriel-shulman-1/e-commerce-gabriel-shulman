const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const productSocket = require("./src/sockets/products.sockets.js");
const cartSocket = require("./src/sockets/cart.sockets.js")
const app = express();
const PORT = 8080;

// HTTP + Socket
const server = http.createServer(app);
const io = new Server(server);
mongoose
  .connect(
    "mongodb+srv://gesover_db_user:KAVnYc!7Tx6c.R4@cluster0.m9sroh3.mongodb.net/?appName=Cluster0"
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
    eq: (a, b) => a === b
  }
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));
app.use(
  "/bootstrap-icons",
  express.static(path.join(__dirname, "node_modules", "bootstrap-icons"))
);
// rutas HTTP
const products = require("./src/routes/products.routes");
const cart = require("./src/routes/cart.routes");
const views = require("./src/routes/views.routes");

app.use("/", views);
app.use("/api/products", products);
app.use("/api/cart", cart);

io.on("connection", (socket) => {
  productSocket(io, socket);
  cartSocket(io, socket);
});

// server
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
