const express = require("express");
const router = express.Router();
const FileManager = require("../utils/fileManager.js");
const productsFile = new FileManager("products.json");
const ProductService = require("../services/product.services.js");
const ProductController = require("../controller/product.controller.js");
router.get("/", async (req, res) => {
  try {
    const products = await productsFile.read();

    res.render("home", {
      title: "Inicio | E-commerce",
      products,
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
      products,
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista");
  }
});

router.get("/products-rt", async (req, res) => {
  try {
    const products = await ProductService.list();
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al cargar datos de productos");
  }
});

router.get("/cart", async (req, res) => {
  try {
    const products = await ProductService.list();
    res.render("cart", {
      title: "Resumen de compra",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al cargar datos de productos");
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = (await ProductService.findById(id)).toObject();
    res.render("product", {
      title: "producto",
      product: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al cargar datos de productos");
  }
});

router.get("/products-filtered", async (req, res) => {
  try {
    const { page, limit, sort, filter, query, priceMin, priceMax } = req.query;
    const result = await ProductService.listPaginated({
      page,
      limit,
      sort,
      filter,
      query,
      priceMin,
      priceMax,
    });
    return res.render("products-filtered", {
      products: result.items,
      pagination: result.pagination,
      filters: ["title", "category", "description"],
      applied: { query, filter, sort, priceMin, priceMax },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});

module.exports = router;
