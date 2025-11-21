const express = require("express");
const app = express();
const PORT = 8080;
const products = require("./routes/products.routes.js");
const cart = require("./routes/cart.routes.js");

app.use(express.json());
app.use("/api/products", products);
app.use("/api/cart", cart);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});