const express = require("express");
const router = express.Router();
const FileManager = require("../utils/fileManajer.js");
const productsFile = new FileManager("products.json");

router.get("/:pid", async (req, res) => {
  try {
    const products = await productsFile.read();
    const product = products.find(p => p.id == req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productsFile.read();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const products = await productsFile.read();
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
    products.push(newProduct);
    await productsFile.write(products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const products = await productsFile.read();
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
    const updates = req.body;
    if (updates.id) delete updates.id;
    products[index] = { ...products[index], ...updates };
    await productsFile.write(products);
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const products = await productsFile.read();
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
    const deleted = products.splice(index, 1);
    await productsFile.write(products);
    res.json({ message: "Producto eliminado", deleted });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
