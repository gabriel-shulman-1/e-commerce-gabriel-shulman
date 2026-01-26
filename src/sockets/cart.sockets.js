const CartService = require("../services/cart.services");

module.exports = (io, socket) => {
  socket.on("cart:getCount", async () => {
    let count = await CartService.getCount();
    socket.emit("cart:count", count);
  });

  socket.on("cart:getAll", async () => {
    const cart = await CartService.getCart();
    socket.emit("cart:all", cart);
  });

  socket.on("cart:add", async ({ productId, quantity }) => {
    await CartService.add(productId, quantity);
    const count = await CartService.getCount();
    io.emit("cart:count", count);
    const cart = await CartService.getCart();
    io.emit("cart:all", cart);
  });

  socket.on("cart:updateQty", async ({ productId, quantity }) => {
    await CartService.update(productId, quantity);
    const cart = await CartService.getCart();
    io.emit("cart:all", cart);
    const count = await CartService.getCount();
    io.emit("cart:count", count);
  });

  socket.on("cart:remove", async ({ productId }) => {
    await CartService.remove(productId);
    const count = await CartService.getCount();
    io.emit("cart:count", count);
    const cart = await CartService.getCart();
    io.emit("cart:all", cart);
  });

  socket.on("cart:clear", async () => {
    await CartService.clear();
    io.emit("cart:count", 0);
    io.emit("cart:all", { products: [] });
  });

  socket.on("cart:purchase", async () => {
    try {
      await CartService.purchase();
      socket.emit("cart:purchase:done", { ok: true });
    } catch (err) {
      socket.emit("cart:purchase:error", err.message);
    }
  });
};
