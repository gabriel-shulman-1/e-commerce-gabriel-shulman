const Cart = require("../models/cart.model.js");
const Product = require("../models/products.model.js");

const CartController = {
  getCart: async (req, res) => {
    try {
      let cart = await Cart.findOne({}).populate("products.product");

      if (!cart) {
        cart = await Cart.create({ products: [] });
      }

      const totalItems = cart.products.reduce((acc, p) => acc + p.quantity, 0);
      const totalCost = cart.products.reduce(
        (acc, p) => acc + p.product.price * p.quantity,
        0
      );

      return res.status(200).json({
        status: "success",
        payload: cart.products,
        totalItems,
        totalCost,
      });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
  addProductToCart: async (req, res) => {
    try {
      const { pid } = req.params;

      let cart = await Cart.findOne({});
      if (!cart) {
        cart = await Cart.create({ products: [] });
      }

      const productExists = await Product.findById(pid);
      if (!productExists) {
        return res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });
      }

      const item = cart.products.find((p) => p.product.toString() === pid);

      if (item) {
        item.quantity++;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      req.io.emit("cartUpdated", cart);

      return res
        .status(200)
        .json({ status: "success", message: "Producto agregado" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
  updateCart: async (req, res) => {
    try {
      const { products } = req.body;

      if (!Array.isArray(products)) {
        return res
          .status(400)
          .json({ status: "error", message: "products debe ser un array" });
      }

      let cart = await Cart.findOne({});
      if (!cart) {
        cart = await Cart.create({ products: [] });
      }

      cart.products = products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      await cart.save();
      req.io.emit("cartUpdated", cart);

      return res
        .status(200)
        .json({ status: "success", message: "Carrito actualizado" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
  updateSingleProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const { quantity } = req.body;

      if (quantity == null || quantity < 1) {
        return res
          .status(400)
          .json({ status: "error", message: "quantity inválido" });
      }

      let cart = await Cart.findOne({});
      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", message: "Carrito no existe" });
      }

      const item = cart.products.find((p) => p.product.toString() === pid);

      if (!item) {
        return res
          .status(404)
          .json({ status: "error", message: "Producto no está en el carrito" });
      }

      item.quantity = quantity;
      await cart.save();

      req.io.emit("cartUpdated", cart);
      return res
        .status(200)
        .json({ status: "success", message: "Producto actualizado" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
  deleteProductFromCart: async (req, res) => {
    try {
      const { pid } = req.params;
      let cart = await Cart.findOne({});

      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", message: "Carrito no existe" });
      }

      cart.products = cart.products.filter((p) => p.product.toString() !== pid);
      await cart.save();

      req.io.emit("cartUpdated", cart);
      return res
        .status(200)
        .json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
  clearCart: async (req, res) => {
    try {
      let cart = await Cart.findOne({});
      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", message: "Carrito no existe" });
      }

      cart.products = [];
      await cart.save();

      req.io.emit("cartUpdated", cart);
      return res
        .status(200)
        .json({ status: "success", message: "Carrito vacío" });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  },
};

exports.CartController = CartController;
