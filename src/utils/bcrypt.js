const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};
const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
const isSamePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
module.exports = {
  createHash,
  isValidPassword,
  isSamePassword
};