const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { createApp } = require("../src/app.js");

jest.mock("../src/repositories/user.repo");

jest.mock("../src/utils/mailer", () => jest.fn());

jest.mock("../src/utils/tokens", () => ({
  generateToken: jest.fn(),
  generateResetToken: jest.fn(),
}));

jest.mock("../src/utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("../src/utils/bcrypt", () => ({
  isValidPassword: jest.fn(),
  isSamePassword: jest.fn(),
  createHash: jest.fn(),
}));

const UserRepository = require("../src/repositories/user.repo");
const bcrypt = require("../src/utils/bcrypt");
const tokens = require("../src/utils/tokens");
const sendEmail = require("../src/utils/mailer");
const jwt = require("../src/utils/jwt");
const app = createApp();
const createRepo = () => new UserRepository();

describe("/api/auth/register", () => {
  test("debe registrar un usuario", async () => {
    const mockRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      getUserById: jest.fn(),
    };
    mockRepository.getUserByEmail.mockResolvedValue(null);
    mockRepository.createUser.mockResolvedValue({
      _id: faker.string.uuid(),
      email: faker.internet.email(),
    });
    const response = await request(app).post("/api/auth/register").send({
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
      _id: faker.string.uuid(),
      email: faker.internet.email(),
    });
    const response = await request(app).post("/api/auth/register").send({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: 30,
      password: "123456",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "El usuario ya existe",
    });
  });
});

describe("/api/auth/login", () => {
  test("debe iniciar sesión", async () => {
    const repo = createRepo();
    repo.getUserByEmail.mockResolvedValue({
      _id: "1",
      email: faker.internet.email(),
      password: "hash",
    });
    bcrypt.isValidPassword.mockReturnValue(true);
    tokens.generateToken.mockReturnValue("fake-jwt");
    const response = await request(app).post("/api/auth/login").send({
      email: "test@mail.com",
      password: "123456",
    });
    expect(response.status).toBe(302);
  });

  test("debe rechazar usuario inexistente", async () => {
    const repo = createRepo();

    repo.getUserByEmail.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send({
      email: "fake@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(302);
  });
});

describe("/api/auth/forgot-password", () => {
  test("debe enviar email de recuperación", async () => {
    const email = faker.internet.email();

    UserRepository.prototype.getUserByEmail.mockResolvedValue({
      _id: "1",
      email: email,
    });

    tokens.generateResetToken.mockReturnValue("reset-token");

    sendEmail.mockResolvedValue(true);

    const response = await request(app).post("/api/auth/forgot-password").send({
      email,
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Email enviado",
      url: "http://localhost:8080/reset-password?token=reset-token",
    });

    expect(tokens.generateResetToken).toHaveBeenCalled();

    expect(sendEmail).toHaveBeenCalledWith(
      email,
      "Recuperación de contraseña",
      expect.stringContaining("reset-token"),
    );
  });
});

describe("/api/auth/reset-password", () => {
  test("debe actualizar password", async () => {
    jwt.verifyToken.mockReturnValue({
      id: "1",
    });
    const fakeUser = {
      password: "oldHash",
      save: jest.fn().mockResolvedValue(),
    };
    UserRepository.prototype.getUserById.mockResolvedValue(fakeUser);
    bcrypt.isSamePassword.mockReturnValue(false);
    bcrypt.createHash.mockReturnValue("newHash");
    const response = await request(app).post("/api/auth/reset-password").send({
      token: "token",
      password: "newPassword",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Contraseña actualizada correctamente",
    });
    expect(fakeUser.password).toBe("newHash");
    expect(fakeUser.save).toHaveBeenCalledTimes(1);
  });
});

describe("/api/auth/logout", () => {
  test("debe cerrar sesión", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(302);
  });
});
