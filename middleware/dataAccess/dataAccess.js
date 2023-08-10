const fs = require("fs").promises;
const path = require("path");

class JSONDatabase {
  constructor(dataFolderPath) {
    this.dataFolderPath = dataFolderPath;
  }

  getFilePath(filename) {
    return path.join(this.dataFolderPath, `data.d${filename}.json`);
  }

  async readDataFromFile(filename) {
    const filePath = this.getFilePath(filename);
    try {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error}`);
      return null;
    }
  }

  async writeDataToFile(filename, newData) {
    const filePath = this.getFilePath(filename);
    try {
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
    } catch (error) {
      console.error(`Error writing to file ${filePath}: ${error}`);
    }
  }

  async updateData(filename, newData) {
    const existingData = await this.readDataFromFile(filename);
    if (existingData) {
      const updatedData = existingData.map((item) =>
        item.id === newData.id ? newData : item
      );
      await this.writeDataToFile(filename, updatedData);
    }
  }

  async addData(filename, newData) {
    const existingData = await this.readDataFromFile(filename);
    if (existingData) {
      existingData.push(newData);
      await this.writeDataToFile(filename, existingData);
    }
  }

  async deleteDataById(id) {
    try {
      const dataItemToDelete = await this.findDataById(id);
  
      if (dataItemToDelete) {
        const date = new Date(dataItemToDelete.date);
        const filename = `${date.getFullYear()}`;
        const data = await this.readDataFromFile(filename);
        const newData = data.filter((item) => item.id !== id);
        await this.writeDataToFile(filename, newData);
        
        console.log(`Item with id ${id} has been deleted.`);
        console.log(`Deleted item:`, dataItemToDelete);
  
        // Automatically reload the page
        // You can replace this with your actual reload logic
        // This example demonstrates a browser-like page reload
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        console.log(`Item with id ${id} is already deleted.`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
  

  async getAllData() {
    const files = await fs.readdir(this.dataFolderPath);

    const allData = [];

    for (const file of files) {
      if (file.startsWith("data.d") && file.endsWith(".json")) {
        const filename = file.slice(6, -5);
        const data = await this.readDataFromFile(filename);

        if (Array.isArray(data) && data.length > 0) {
          allData.push(...data);
        }
      }
    }

    return allData;
  }

  async findDataById(id) {
    const allData = await this.getAllData();
    return allData.find((dataItem) => dataItem.id === id);
  }
}

module.exports = JSONDatabase;
