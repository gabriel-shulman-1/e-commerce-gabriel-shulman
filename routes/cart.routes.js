const express = require("express");
const router = express.Router();
const FileManager = require("../utils/fileManajer.js");
const cartsFile = new FileManager("cart.json");
const productsFile = new FileManager("products.json");
const validateProductStock = require("../utils/validateProductStock.js");

router.post("/", async (req, res) => {
  try {
    const carts = await cartsFile.read();
    const newId = carts.length > 0
      ? Math.max(...carts.map(c => c.id)) + 1
      : 1;
    const newCart = {
      id: newId,
      products: []
    };
    carts.push(newCart);
    await cartsFile.write(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const carts = await cartsFile.read();
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantityRequested = req.body.quantity || 1;
    const carts = await cartsFile.read();
    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const cart = carts[cartIndex];
    const products = await productsFile.read();
    const product = products.find(p => p.id == pid);
    const existingInCart = cart.products.find(p => p.product == pid);
    const currentQuantityInCart = existingInCart ? existingInCart.quantity : 0;
    const validation = validateProductStock(
      product,
      quantityRequested,
      currentQuantityInCart
    );
    if (!validation.ok) {
      return res.status(400).json({ error: validation.error });
    }
    if (existingInCart) {
      existingInCart.quantity += quantityRequested;
    } else {
      cart.products.push({
        product: pid,
        quantity: quantityRequested
      });
    }
    carts[cartIndex] = cart;
    await cartsFile.write(carts);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
