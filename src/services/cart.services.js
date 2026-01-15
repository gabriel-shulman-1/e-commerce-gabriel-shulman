const CartRepository = require("../repositories/cart.repo");
const ProductRepository = require("../repositories/product.repo");
class CartService {
  async getCart() {
    const cart = await CartRepository.getCart();
    return cart;
  }

  async getCount() {
    const cart = await CartRepository.getCart();
    console.log(cart);
    const count = cart.products.reduce((acc, p) => acc + p.quantity, 0);
    console.log(count);
    return count;
  }

  async add(productId, quantity = 1) {
    const cart = await CartRepository.addProduct(productId, quantity);
    return cart;
  }

  async update(productId, quantity) {
    const cart = await CartRepository.updateQuantity(productId, quantity);
    return cart;
  }

  async remove(productId) {
    const cart = await CartRepository.removeProduct(productId);
    return cart;
  }

  async clear() {
    const cart = await CartRepository.clearCart();
    return cart;
  }

  async purchase() {
    const cart = await CartRepository.getCart();
    console.log("carrito repository ", cart);
    if (!cart || !cart.products || cart.products.length === 0) {
      throw new Error("Carrito vacío");
    }
    for (const item of cart.products) {
      const product = await ProductRepository.findById(item.product._id);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.product._id}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente: ${product.title}`);
      }
    }
    for (const item of cart.products) {
      await ProductRepository.updateStock(item.product._id, -item.quantity);
    }
    await CartRepository.clearCart();
    return { success: true };
  }
}

module.exports = new CartService();
