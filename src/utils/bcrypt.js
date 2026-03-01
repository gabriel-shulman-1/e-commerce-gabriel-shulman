const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};
const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
module.exports = {
  createHash,
  isValidPassword
};