const ProductService = require("../services/product.services.js");

module.exports = (io, socket) => {
  console.log("Socket products listo");
  socket.on("get-products", async () => {
    const products = await ProductService.list();
    socket.emit("products-list", products);
  });
  socket.on("products-one", async (id) => {
    try {
      const product = await ProductService.findById(id);
      socket.emit("products-one", product);
    } catch (err) {
      socket.emit("products-error", err.message);
    }
  });
  socket.on("create-product", async (data) => {
    await ProductService.create(data);
    const products = await ProductService.list();
    io.emit("products-list", products);
  });
  socket.on("delete-product", async (id) => {
    console.log(id);
    await ProductService.delete(id);
    const products = await ProductService.list();
    io.emit("products-list", products);
  });
  socket.on("product:get", async (id) => {
    const product = await ProductService.findById(id);
    socket.emit("product:data", product);
  });
  socket.on("product:update", async ({ id, data }) => {
    const updated = await ProductService.update(id, data);
    io.emit("product:updated", updated);
  });
};
