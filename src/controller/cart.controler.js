const CartService = require("../services/cart.services.js");
const CartController = {
  getCart: async (req, res) => {
    const cart = await CartService.getCart();
    res.json(cart || { products: [] });
  },

  getQuantity: async (req, res) => {
    const count = await CartService.getCount();
    res.json({ count });
  },

  addCart: async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const cart = await CartService.add(productId, quantity);
    res.json(cart);
  },

  updateElement: async (req, res) => {
    const { quantity } = req.body;
    const updated = await CartService.update(req.params.productId, quantity);
    res.json(updated);
  },

  deleteElement: async (req, res) => {
    const updated = await CartService.remove(req.params.productId);
    res.json(updated);
  },

  deleteAll: async (req, res) => {
    const updated = await CartService.clear();
    res.json(updated);
  }
};


module.exports = CartController;
