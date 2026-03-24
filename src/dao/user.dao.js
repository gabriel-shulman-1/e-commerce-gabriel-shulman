const UserModel = require("../models/user.model");
class UserDAO {
  async getByEmail(email) {
    return await UserModel.findOne({email});
  }
  async getById(id) {
    return await UserModel.findById(id);
  }
  async create(userData) {
    return await UserModel.create(userData);
  }
}
module.exports = UserDAO;