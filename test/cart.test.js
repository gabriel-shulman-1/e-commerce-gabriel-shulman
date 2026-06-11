const request = require("supertest");
const { createApp } = require("../src/app");

const CartService = require("../src/services/cart.services");

jest.mock("../src/services/cart.services");

jest.mock("../src/middlewares/auth.middleware", () => ({
  authMiddleware: (req, res, next) => {
    const { faker } = require("@faker-js/faker");
    req.user = {
      _id: faker.string.uuid(),
      role: "user",
    };
    next();
  },

  authLevel: () => (req, res, next) => next(),
}));

const app = createApp();

describe("Cart API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/cart", () => {
    test("debe devolver el carrito", async () => {
      const fakeCart = {
        products: [],
      };

      CartService.getCart.mockResolvedValue(fakeCart);

      const response = await request(app).get("/api/cart");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeCart);
    });
  });

  describe("GET /api/cart/qty", () => {
    test("debe devolver la cantidad total", async () => {
      CartService.getCount.mockResolvedValue(3);

      const response = await request(app).get("/api/cart/qty");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        count: 3,
      });
    });
  });

  describe("POST /api/cart", () => {
    test("debe agregar un producto", async () => {
      const { faker } = require("@faker-js/faker");
      const productId = faker.string.uuid();

      const fakeCart = {
        products: [
          {
            productId,
            quantity: 2,
          },
        ],
      };
      CartService.add.mockResolvedValue(fakeCart);
      const response = await request(app).post("/api/cart").send({
        productId,
        quantity: 2,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeCart);
    });
  });

  describe("PUT /api/cart/:productId", () => {
    test("debe actualizar la cantidad de un producto", async () => {
      const { faker } = require("@faker-js/faker");
      const productId = faker.string.uuid();

      const fakeCart = {
        updated: true,
      };

      CartService.update.mockResolvedValue(fakeCart);

      const response = await request(app).put(`/api/cart/${productId}`).send({
        quantity: 5,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeCart);
    });
  });

  describe("DELETE /api/cart/:productId", () => {
    test("debe eliminar un producto", async () => {
      const { faker } = require("@faker-js/faker");
      const productId = faker.string.uuid();

      const fakeCart = {
        removed: true,
      };

      CartService.remove.mockResolvedValue(fakeCart);

      const response = await request(app).delete(`/api/cart/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeCart);
    });
  });

  describe("DELETE /api/cart", () => {
    test("debe vaciar el carrito", async () => {
      const fakeCart = {
        products: [],
      };

      CartService.clear.mockResolvedValue(fakeCart);

      const response = await request(app).delete("/api/cart");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeCart);
    });
  });
});
