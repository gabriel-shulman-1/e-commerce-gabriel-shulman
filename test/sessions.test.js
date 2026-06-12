const express = require("express");
const request = require("supertest");
const { faker } = require("@faker-js/faker");

const fakeUser = {
  _id: "123",
  email: "test@test.com",
  role: "user",
};

jest.mock("passport", () => ({
  authenticate: jest.fn(() => {
    return (req, res, next) => {
      req.user = fakeUser;
      next();
    };
  }),
}));
jest.mock("../src/utils/tokens");

const tokenUtil = require("../src/utils/tokens");
const passport = require("passport");
const sessionRouter = require("../src/routes/sessions.routes");
const app = express();
app.use(express.json());
app.use("/api/sessions", sessionRouter);
describe("Sessions Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("POST /login", () => {
    it("login exitoso", async () => {
      const fakeUser = {
        _id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        role: "user",
        first_name: faker.person.firstName(),
      };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => {
            callback(null, fakeUser, null);
          };
        },
      );
      tokenUtil.generateToken.mockReturnValue("fake-token");
      const res = await request(app).post("/api/sessions/login").send({
        email: fakeUser.email,
        password: "123456",
      });
      expect(res.status).toBe(200);
      expect(res.body.access_token).toBe("fake-token");
    });
  });
  describe("GET /current", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("usuario autenticado", async () => {
      const response = await request(app).get("/api/sessions/current");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        status: "success",
        user: {
          id: "123",
          email: "test@test.com",
          role: "user",
        },
      });
    });

    test("rechaza acceso sin token", async () => {
      jest.resetModules();

      jest.doMock("passport", () => ({
        authenticate: () => {
          return (req, res) => {
            res.status(401).json({
              message: "Unauthorized",
            });
          };
        },
      }));

      const express = require("express");
      const request = require("supertest");

      const router = require("../src/routes/sessions.routes");

      const app = express();

      app.use(express.json());
      app.use("/api/sessions", router);

      const response = await request(app).get("/api/sessions/current");

      expect(response.status).toBe(401);
    });
  });
});
