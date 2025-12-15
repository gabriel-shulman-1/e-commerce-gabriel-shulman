const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 8080;

// HTTP + Socket
const server = http.createServer(app);
const io = new Server(server);

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
    layoutsDir: path.join(__dirname, "src", "views", "layouts")
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

// rutas HTTP
const products = require("./src/routes/products.routes.js");
const cart = require("./src/routes/cart.routes.js");
const views = require("./src/routes/views.routes.js");

app.use("/", views);
app.use("/api/products", products);
app.use("/api/cart", cart);

// 🚀 SOCKETS (ESTO FALTABA)
require("./src/sockets/products.sockets.js")(io);

// server
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
