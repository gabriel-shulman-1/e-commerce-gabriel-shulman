const FileManager = require("../utils/FileManager.js");
const productsFile = new FileManager("products.json");

module.exports = (io) => {
  io.on("connection", async (socket) => {

    socket.on("products:create", async (data) => {
      const products = await productsFile.read();

      const newProduct = {
        id:
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        title: data.title,
        description: data.description,
        code: data.code,
        price: data.price,
        status: true,
        stock: data.stock,
        category: data.category,
        thumbnails: ["sin-imagen"],
      };

      products.push(newProduct);
      await productsFile.write(products);

      io.emit("products:list", products);
    });

    socket.on("products:update", async ({ id, data }) => {
      const products = await productsFile.read();
      const index = products.findIndex((p) => p.id == id);

      if (index === -1) return;

      products[index] = {
        ...products[index],
        ...data,
        id: products[index].id,
      };

      await productsFile.write(products);
      io.emit("products:list", products);
    });

    socket.on("products:delete", async (id) => {
      let products = await productsFile.read();
      products = products.filter((p) => p.id != id);

      await productsFile.write(products);
      io.emit("products:list", products);
    });

    socket.on("products:request", async () => {
      const products = await productsFile.read();
      socket.emit("products:list", products);
    });
  });
};
