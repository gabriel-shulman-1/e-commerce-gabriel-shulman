const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { createApp } = require("../src/app");

const app = createApp();

jest.mock("passport", () => ({
  authenticate: () => (req, res, next) => {
    req.user = {
      _id: "123",
      email: "test@mail.com",
      role: "admin",
    };
    next();
  },
  initialize: () => (req, res, next) => next(),
}));

const passport = require("passport");

describe("Sessions API", () => {
  const { faker } = require("@faker-js/faker");
  beforeEach(() => {
    jest.clearAllMocks();
    fakeUser = {
      _id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      email: faker.internet.email(),
      role: "admin",
    };
  });
  describe("POST /api/sessions/login", () => {
    test("debe iniciar sesión correctamente", async () => {
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, fakeUser, null);
          };
        },
      );

      const response = await request(app).post("/api/sessions/login").send({
        email: faker.email,
        password: faker.password,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: "success",
          access_token: expect.any(String),
        }),
      );
    });
    test("debe rechazar credenciales inválidas", async () => {
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, false, { message: "Credenciales inválidas" });
          };
        },
      );

      const response = await request(app).post("/api/sessions/login").send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          status: "error",
        }),
      );
    });
  });

  describe("GET /api/sessions/current", () => {
    test("debe devolver el usuario autenticado", async () => {
        const { faker } = require("@faker-js/faker");
      const response = await request(app).get("/api/sessions/current");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "success",
          user: expect.objectContaining({
            email: "test@mail.com",
          }),
        }),
      );
    });
    test("debe rechazar acceso sin token", async () => {
      passport.authenticate.mockImplementation(() => (req, res) => {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      });

      const response = await request(app).get("/api/sessions/current");

      expect(response.status).toBe(401);
    });
  });
});
