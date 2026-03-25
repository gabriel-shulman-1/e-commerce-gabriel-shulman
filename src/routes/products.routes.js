const express = require("express");
const router = express.Router();
const ProductController = require("../controller/product.controller.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js"); 
router.get("/", authMiddleware, authLevel("admin"), ProductController.list);
router.get("/:id", authMiddleware, authLevel("admin"), ProductController.getById);
router.post("/", authMiddleware, authLevel("admin"), ProductController.create);
router.put("/:id", authMiddleware, authLevel("admin"), ProductController.update);
router.delete("/:id", authMiddleware, authLevel("admin"), ProductController.delete);
router.post("/purchase", authMiddleware, authLevel("admin"), ProductController.purchase);
router.get("/products/edit/:id", authMiddleware, authLevel("admin"), ProductController.editProduct);
module.exports = router;
