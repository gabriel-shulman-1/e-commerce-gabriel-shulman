const UserDAO = require("../dao/user.dao");
class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }
  async getUserByEmail(email) {
    return await this.dao.getByEmail(email);
  }
  async getUserById(id) {
    return await this.dao.getById(id);
  }
  async createUser(userData) {
    return await this.dao.create(userData);
  }
}
module.exports = UserRepository;
