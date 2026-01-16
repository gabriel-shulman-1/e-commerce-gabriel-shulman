const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product.controller.js");

router.get("/", ProductController.list);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);
router.post("/purchase", ProductController.purchase);
router.get("/products/edit/:id", ProductController.editProduct);
module.exports = router;
