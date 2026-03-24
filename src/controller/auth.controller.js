//const User = require("../models/user.model");
const {
  createHash,
  isValidPassword,
  isSamePassword,
} = require("../utils/bcrypt");
const jwtToken = require("../utils/jwt");
const UserRepository = require("../repositories/user.repo");
const Tokens = require("../utils/tokens");
const sendEmail = require("../utils/mailer");
const userRepository = new UserRepository();
const authController = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const exists = await userRepository.getUserByEmail(email);
      if (exists) {
        return res.status(400).json({
          error: "El usuario ya existe",
        });
      }
      const newUser = await userRepository.createUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role: "user",
      });
      res.status(201).json({
        message: "Usuario creado correctamente",
        userId: newUser._id,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.redirect("/login?error=Usuario no encontrado");
      }
      if (!isValidPassword(user, password)) {
        return res.redirect("/login?error=Contraseña incorrecta");
      }
      const token = Tokens.generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      return res.redirect("/createProduct");
    } catch (error) {
      return res.redirect("/login?error=Error interno");
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const token = Tokens.generateResetToken(user);
      const resetLink = `http://localhost:8080/reset-password?token=${token}`;
      await sendEmail(
        user.email,
        "Recuperación de contraseña",
        `
      <h3>Recuperar contraseña</h3>
      <p>Hacé click en el siguiente botón:</p>
      <a href="${resetLink}">
        <button>Restablecer contraseña</button>
      </a>
      <p>Este enlace expira en 1 hora</p>
    `,
      );
      res.json({ message: "Email enviado", link: resetLink });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    const { token, password } = req.body;
    try {
      const decoded = await jwtToken.verifyToken(token, process.env.JWT_SECRET);
      const user = await userRepository.getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const isSame = isSamePassword(password, user.password);
      if (isSame) {
        return res.status(400).json({
          message: "No podés usar la misma contraseña anterior",
        });
      }
      const newHashedPassword = createHash(password, 10);
      user.password = newHashedPassword;
      await user.save();
      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      return res.status(400).json({
        message: "Token inválido o expirado",
      });
    }
  },
};

module.exports = authController;
