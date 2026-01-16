const router = require("express").Router();
const CartController = require ("../controller/cart.controler.js");

router.get("/", CartController.getCart);
router.get("/qty", CartController.getQuantity);
router.post("/", CartController.addCart);
router.put("/:productId", CartController.updateElement);
router.put("/", CartController.updateAll);
router.delete("/:productId/:qty", CartController.deleteElement);
router.delete("/", CartController.deleteAll);

module.exports = router;
