const ProductRepo = require("../repositories/product.repo.js");

const ProductService = {
  async list() {
    return ProductRepo.findAll();
  },
  async findById(id) {
    const product = await ProductRepo.findById(id);
    if (!product) throw new Error("El producto no existe");
    return product;
  },
  async create(data) {
    const exists = await ProductRepo.findById(data.id);
    if (exists) throw new Error("Product id already exists");
    return ProductRepo.create(data);
  },
  async update(id, data) {
    const updated = await ProductRepo.update(id, data);
    console.log(updated);
    if (!updated) throw new Error("Product not found");
    return updated;
  },
  async delete(id) {
    console.log(id)
    const deleted = await ProductRepo.delete(id);
    if (!deleted) throw new Error("Product not found");
    return deleted;
  },
  async listPaginated({
    page = 1,
    limit = 12,
    sort,
    filter,
    query,
    priceMin,
    priceMax,
  }) {
    const allowedFilters = ["title", "category", "description"];
    let mongoFilter = {};
    if (query) {
      if (filter && allowedFilters.includes(filter)) {
        mongoFilter[filter] = { $regex: query, $options: "i" };
      } else {
        mongoFilter = {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        };
      }
    }
    if (priceMin || priceMax) {
      mongoFilter.price = {};
      if (priceMin) mongoFilter.price.$gte = Number(priceMin);
      if (priceMax) mongoFilter.price.$lte = Number(priceMax);
    }
    const sortConfig = {};
    if (sort === "asc") sortConfig.price = 1;
    if (sort === "desc") sortConfig.price = -1;
    const options = {
      page: Number(page),
      limit: Number(limit),
      lean: true,
    };
    if (Object.keys(sortConfig).length > 0) {
      options.sort = sortConfig;
    }
    return ProductRepo.listPaginated(mongoFilter, options);
  },
  async purchase(items) {
    for (const item of items) {
      const product = await ProductRepo.findById(item.productId);
      if (!product) throw new Error("Producto no encontrado");
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.title}`);
      }
    }
    for (const item of items) {
      await ProductRepo.updateStock(item.productId, -item.quantity);
    }
    return { success: true };
  },
};

module.exports = ProductService;
