const request = require("supertest");
const { createApp } = require("../src/app");

const ProductService = require("../src/services/product.services.js");

jest.mock("../src/services/product.services.js");
jest.mock("../src/middlewares/auth.middleware.js", () => ({
  authMiddleware: (req, res, next) => {
    req.user = {
      _id: "123",
      role: "admin",
    };
    next();
  },

  authLevel: () => (req, res, next) => next(),
}));
const app = createApp();
describe("Products Router", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {

    test("debe devolver la lista de productos", async () => {

      ProductService.list.mockResolvedValue([
        {
          _id: "1",
          title: "Notebook",
          price: 1000,
        },
      ]);

      const response = await request(app)
        .get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(ProductService.list).toHaveBeenCalled();

    });

    test("debe devolver error cuando falla el servicio", async () => {

      ProductService.list.mockRejectedValue(
        new Error("Error interno")
      );

      const response = await request(app)
        .get("/api/products");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Error interno");

    });

  });

  describe("GET /api/products/:id", () => {

    test("debe devolver un producto", async () => {

      ProductService.findById.mockResolvedValue({
        _id: "1",
        title: "Mouse",
      });

      const response = await request(app)
        .get("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Mouse");

    });

  });

  describe("POST /api/products", () => {

    test("debe crear un producto", async () => {

      ProductService.create.mockResolvedValue({
        _id: "1",
        title: "Nuevo Producto",
      });

      const response = await request(app)
        .post("/api/products")
        .send({
          title: "Nuevo Producto",
          description: "Demo",
          price: 100,
          stock: 10,
          category: "Hardware",
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Nuevo Producto");

    });

  });

  describe("PUT /api/products/:id", () => {

    test("debe actualizar un producto", async () => {

      ProductService.update.mockResolvedValue({
        _id: "1",
        title: "Producto Actualizado",
      });

      const response = await request(app)
        .put("/api/products/1")
        .send({
          title: "Producto Actualizado",
        });

      expect(response.status).toBe(200);
      expect(response.body.title)
        .toBe("Producto Actualizado");

    });

  });

  describe("DELETE /api/products/:id", () => {

    test("debe eliminar un producto", async () => {

      ProductService.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body.deleted).toBe(true);

    });

  });

  describe("POST /api/products/purchase", () => {

    test("debe procesar una compra", async () => {

      ProductService.purchase.mockResolvedValue({
        success: true,
      });

      const response = await request(app)
        .post("/api/products/purchase")
        .send({
          items: [
            {
              productId: "1",
              quantity: 2,
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

    });

  });

});