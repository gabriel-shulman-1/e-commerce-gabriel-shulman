const ProductService = require("../services/product.services.js");
const viewController = {
  inicio: async (req, res) => {
    try {
      res.render("home", {
        title: "Inicio | E-commerce",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar la vista");
    }
  },
  products_rt: async (req, res) => {
    try {
      const products = await ProductService.list();
      res.render("realTimeProducts", {
        title: "Productos en tiempo real",
        products,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error al cargar datos de productos");
    }
  },
  cart: async (req, res) => {
    try {
      const products = await ProductService.list();
      res.render("cart", {
        title: "Resumen de compra",
        products,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error al cargar datos de productos");
    }
  },
  product_id: async (req, res) => {
    try {
      const { id } = req.params;
      const product = (await ProductService.findById(id)).toObject();
      res.render("product", {
        title: "producto",
        product: product,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error al cargar datos de productos");
    }
  },
  products_filtered: async (req, res) => {
    try {
      const { page, limit, sort, filter, query, priceMin, priceMax } =
        req.query;
      const result = await ProductService.listPaginated({
        page,
        limit,
        sort,
        filter,
        query,
        priceMin,
        priceMax,
      });
      return res.render("products-filtered", {
        products: result.items,
        pagination: result.pagination,
        filters: ["title", "category", "description"],
        applied: { query, filter, sort, priceMin, priceMax },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al obtener productos");
    }
  },
  createProduct : async (req,res) => {
    try {
      const products = await ProductService.list();
      res.render("createProduct",{
        title:"Gestionar productos",
        products
      })
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar la vista");
    }
  }
};
module.exports = viewController;