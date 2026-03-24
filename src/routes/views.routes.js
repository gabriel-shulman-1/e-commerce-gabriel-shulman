const express = require("express");
const router = express.Router();
const viewController = require("../controller/view.controller.js");
const AuthMiddleware = require("../middlewares/auth.middleware.js");
router.get("/", viewController.inicio);
router.get("/products-rt", viewController.products_rt);
router.get("/cart", viewController.cart);
router.get("/product/:id", viewController.product_id);
router.get("/products-filtered", viewController.products_filtered);
router.get("/createProduct", AuthMiddleware, viewController.createProduct);
router.get("/login", viewController.login);
router.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("reset-password", { token });
});

module.exports = router;
