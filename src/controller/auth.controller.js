const User = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const authController = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({
          error: "El usuario ya existe",
        });
      }

      const newUser = await User.create({
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

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: "Usuario no encontrado",
        });
      }
      if (!isValidPassword(user, password)) {
        return res.status(400).json({
          error: "Contraseña incorrecta",
        });
      }
      const token = generateToken(user);
      res.json({
        message: "Login exitoso",
        userId: user._id,
        role: user.role,
        token: token,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};

module.exports = authController;
