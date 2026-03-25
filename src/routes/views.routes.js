const express = require("express");
const router = express.Router();
const viewController = require("../controller/view.controller.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js");
router.get("/", authMiddleware, authLevel("user","admin"), viewController.inicio);
router.get(
  "/products-rt",
  authMiddleware,
  authLevel("user","admin"),
  viewController.products_rt,
);
router.get("/cart", authMiddleware, authLevel("user"), viewController.cart);
router.get(
  "/product/:id",
  authMiddleware,
  authLevel("user","admin"),
  viewController.product_id,
);
router.get(
  "/products-filtered",
  authMiddleware,
  authLevel("user","admin"),
  viewController.products_filtered,
);
router.get(
  "/createProduct",
  authMiddleware,
  authLevel("admin"),
  viewController.createProduct,
);
router.get("/login", viewController.login);
router.get("/register", viewController.register);
router.get("/forgot-password", viewController.forgotPassword);
router.get("/reset-password", viewController.resetPassword);
module.exports = router;
