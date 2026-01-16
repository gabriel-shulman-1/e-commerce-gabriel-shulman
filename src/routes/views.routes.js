const express = require("express");
const router = express.Router();
const viewController = require("../controller/view.controller.js")
router.get("/", viewController.inicio);
router.get("/products-rt", viewController.products_rt);
router.get("/cart", viewController.cart);
router.get("/product/:id", viewController.product_id);
router.get("/products-filtered", viewController.products_filtered);
router.get("/createProduct", viewController.createProduct);
module.exports = router;
