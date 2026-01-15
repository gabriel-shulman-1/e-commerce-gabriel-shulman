const Product = require("../models/products.model");
const ProductRepo = {
  async findAll() {
    return Product.find().lean();
  },
  async findById(id) {
    return Product.findOne({ _id: id });
  },
  async create(data) {
    return Product.create(data);
  },
  async update(id, data) {
    return Product.findOneAndUpdate({ id }, data, { new: true }).lean();
  },
  async delete(id) {
    return Product.findOneAndDelete({ id }).lean();
  },
  async listPaginated(filter = {}, options = {}) {
    const result = await Product.paginate(filter, options);
    return {
      items: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      },
    };
  },
  async updateStock(id, delta) {
    return Product.findByIdAndUpdate(
      id,
      { $inc: { stock: delta } },
      { new: true }
    );
  },
};
module.exports = ProductRepo;
