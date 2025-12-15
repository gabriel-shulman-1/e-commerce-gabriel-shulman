const fs = require("fs").promises;
const path = require("path");

class FileManager {
  constructor(filename) {
    this.path = path.join(__dirname, "..", "data", filename);
  }

  async read() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async write(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }
}

module.exports = FileManager;