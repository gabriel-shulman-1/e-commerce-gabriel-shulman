const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { createApp } = require("../src/app");

const app = createApp();

jest.mock("../src/repositories/user.repo");
jest.mock("../src/utils/mailer");
jest.mock("../src/utils/tokens");
jest.mock("../src/utils/jwt");
jest.mock("../src/utils/bcrypt");
test("debe registrar un usuario", async () => {

  UserRepository.prototype.getUserByEmail.mockResolvedValue(null);

  UserRepository.prototype.createUser.mockResolvedValue({
    _id: faker.string.uuid(),
    email: faker.internet.email(),
  });

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: 30,
      password: "123456",
    });

  expect(response.status).toBe(302);
});
test("debe rechazar usuario existente", async () => {

  UserRepository.prototype.getUserByEmail.mockResolvedValue({
    _id: "1",
  });

  const response = await request(app)
    .post("/api/auth/register")
    .send({
      email: faker.internet.email(),
    });

  expect(response.status).toBe(400);

  expect(response.body.error)
    .toBe("El usuario ya existe");
});
test("debe iniciar sesión", async () => {

  UserRepository.prototype.getUserByEmail.mockResolvedValue({
    _id: "1",
    email: faker.internet.email(),
    password: "hash",
  });

  require("../src/utils/bcrypt")
    .isValidPassword
    .mockReturnValue(true);

  require("../src/utils/tokens")
    .generateToken
    .mockReturnValue("fake-jwt");

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@mail.com",
      password: "123456",
    });

  expect(response.status).toBe(302);
});
test("debe rechazar usuario inexistente", async () => {

  UserRepository.prototype.getUserByEmail
    .mockResolvedValue(null);

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "fake@mail.com",
      password: "123456",
    });

  expect(response.status).toBe(302);
});
test("debe enviar email de recuperación", async () => {

  UserRepository.prototype.getUserByEmail
    .mockResolvedValue({
      _id: "1",
      email: faker.internet.email(),
    });

  require("../src/utils/tokens")
    .generateResetToken
    .mockReturnValue("reset-token");

  const response = await request(app)
    .post("/api/auth/forgot-password")
    .send({
      email: faker.internet.email(),
    });

  expect(response.status).toBe(200);

  expect(response.body)
    .toHaveProperty("message");
});
test("debe actualizar password", async () => {

  require("../src/utils/jwt")
    .verifyToken
    .mockReturnValue({
      id: "1",
    });

  const fakeUser = {
    password: "oldHash",
    save: jest.fn(),
  };

  UserRepository.prototype.getUserById
    .mockResolvedValue(fakeUser);

  require("../src/utils/bcrypt")
    .isSamePassword
    .mockReturnValue(false);

  require("../src/utils/bcrypt")
    .createHash
    .mockReturnValue("newHash");

  const response = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "token",
      password: "newPassword",
    });

  expect(response.status).toBe(200);

  expect(fakeUser.save)
    .toHaveBeenCalled();
});
test("debe cerrar sesión", async () => {

  const response = await request(app)
    .post("/api/auth/logout");

  expect(response.status).toBe(302);
});