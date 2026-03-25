const router = require("express").Router();
const CartController = require ("../controller/cart.controler.js");
const {
  authMiddleware,
  authLevel,
} = require("../middlewares/auth.middleware.js");
router.get("/", authMiddleware, authLevel("user"), CartController.getCart);
router.get("/qty", authMiddleware, authLevel("user"), CartController.getQuantity);
router.post("/", authMiddleware, authLevel("user"), CartController.addCart);
router.put("/:productId", authMiddleware, authLevel("user"), CartController.updateElement);
router.delete("/:productId", authMiddleware, authLevel("user"), CartController.deleteElement);
router.delete("/", authMiddleware, authLevel("user"), CartController.deleteAll);

module.exports = router;
