const router = require("express").Router();
const CartService = require("../services/cart.services.js");

router.get("/", async (req, res) => {
  const cart = await CartService.getCart();
  res.json(cart || { products: [] });
});
router.get("/qty", async(req,res)=> {
  const cart = await CartService.getTotalItems();
  res.json(cart);
});
router.post("/", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = await CartService.addProduct(productId, quantity);
  res.json(cart);
});
router.put("/:productId", async (req, res) => {
  const { quantity } = req.body;
  const updated = await CartService.updateProduct(req.params.productId, quantity);
  res.json(updated);
});
router.put("/", async (req, res) => {
  const { products } = req.body;
  const updated = await CartService.updateAll(products);
  res.json(updated);
});
router.delete("/:productId/:qty", async (req, res) => {
  const updated = await CartService.deleteProduct(req.params.productId,req.params.qty);
  res.json(updated);
});
router.delete("/", async (req, res) => {
  const updated = await CartService.clearCart();
  res.json(updated);
});

module.exports = router;
