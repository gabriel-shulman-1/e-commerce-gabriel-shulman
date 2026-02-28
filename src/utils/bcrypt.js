const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Hashear contraseña
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};

// Comparar contraseña
const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

module.exports = {
  createHash,
  isValidPassword
};