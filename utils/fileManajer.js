const fs = require("fs").promises;
const path = require("path");

class FileManager {
  constructor(fileName) {
    this.filePath = path.join(__dirname, `../data/${fileName}`);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error leyendo archivo:", this.filePath, error);
      return [];
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error escribiendo archivo:", this.filePath, error);
    }
  }
}

module.exports = FileManager;