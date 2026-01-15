const ProductService = require("../services/product.services");

const ProductController = {
  list: async (req, res) => {
    try {
      const products = await ProductService.findAll();
      res.json(products);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  getById: async (req, res) => {
    try {
      console.log(req.params.id);
      const productById = await ProductService.findById(req.params.id);
      res.json(productById);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  create: async (req, res) => {
    try {
      const product = await ProductService.create(req.body);

      req.io.emit("product:created", product);

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const product = await ProductService.update(req.params.id, req.body);

      req.io.emit("product:updated", product);

      res.json(product);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      await ProductService.delete(req.params.id);
      req.io.emit("product:deleted", { id: req.params.id });
      res.json({ deleted: true });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
  getProductView: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await ProductService.findById(pid);
      if (!product) {
        return res
          .status(404)
          .render("404", { message: "Producto no encontrado" });
      }
      return res.render("product", { product });
    } catch (err) {
      return res.status(500).render("500", { message: err.message });
    }
  },
  async purchase(req, res, next) {
    try {
      const { items } = req.body;
      const result = await ProductService.purchase(items);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProductController;
