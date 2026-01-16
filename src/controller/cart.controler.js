const CartService = require("../services/cart.services.js");
const CartController = {
  getCart : async (req, res) => {
    const cart = await CartService.getCart();
    res.json(cart || { products: [] });
  },
  getQuantity : async(req,res)=> {
    const cart = await CartService.getTotalItems();
    res.json(cart);
  },
  addCart : async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const cart = await CartService.addProduct(productId, quantity);
    res.json(cart);
  },
  updateElement : async (req, res) => {
    const { quantity } = req.body;
    const updated = await CartService.updateProduct(req.params.productId, quantity);
    res.json(updated);
  },
  updateAll : async (req, res) => {
    const { products } = req.body;
    const updated = await CartService.updateAll(products);
    res.json(updated);
  },
  deleteElement : async (req, res) => {
    const updated = await CartService.deleteProduct(req.params.productId,req.params.qty);
    res.json(updated);
  },
  deleteAll : async (req, res) => {
    const updated = await CartService.clearCart();
    res.json(updated);
  }
};

module.exports = CartController;
