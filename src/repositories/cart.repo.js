const Cart = require("../models/cart.model");
const Product = require("../models/products.model");

class CartRepository {
  
  async getCart() {
    let cart = await Cart.findOne().populate("products.product");
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }
    return cart;
  }

  async addProduct(productId, quantity = 1) {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }
    const existing = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
    return cart.populate("products.product");
  }

  async updateQuantity(productId, quantity) {
    const cart = await Cart.findOne();
    if (!cart) return null;
    const existing = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (!existing) return cart;
    existing.quantity = quantity <= 0 ? 1 : quantity;
    await cart.save();
    return cart.populate("products.product");
  }

  async removeProduct(productId) {
    const cart = await Cart.findOne();
    if (!cart) return null;

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    await cart.save();
    return cart.populate("products.product");
  }

  async clearCart() {
    const cart = await Cart.findOne();
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart.populate("products.product");
  }

  async paginate({ page = 1, limit = 10, filter = {}, sort = {} }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

}
module.exports = new CartRepository();
