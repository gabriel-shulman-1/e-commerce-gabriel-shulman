const express = require("express");
const router = express.Router();
const FileManager = require("../utils/fileManager.js");
const productsFile = new FileManager("products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productsFile.read();

    res.render("home", {
      title: "Inicio | E-commerce",
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la vista");
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await productsFile.read();

    res.render("products", {
      title: "Home | Productos",
      products
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista");
  }
});

router.get("/products-rt", async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Productos en tiempo real"
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista");
  }
});

module.exports = router;
