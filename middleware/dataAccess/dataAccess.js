const fs = require("fs").promises;
const path = require("path");

class JSONDatabase {
  constructor(dataFolderPath) {
    this.dataFolderPath = dataFolderPath;
  }

   getFilePath(dataName) {
    return path.join(this.dataFolderPath, `data.d${dataName}.json`);
  } 

  async readDataFromFile(dataName) {
    const filePath = this.getFilePath(dataName);
    try {
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${filePath}: ${error}`);
      return null;
    }
  }

  async writeDataToFile(dataName, newData) {
    const filePath = this.getFilePath(dataName);
    try {
      await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf8");
    } catch (error) {
      console.error(`Error writing to file ${filePath}: ${error}`);
    }
  }

  async editData(id, dataName, updatedData) {
    // Read existing data from the file
    const existingData = await this.readDataFromFile(dataName);

    if (existingData) {
      // Find the index of the item with the specified ID
      const itemIndex = existingData.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Update the existing data with the new data
        existingData[itemIndex] = {
          ...existingData[itemIndex],
          ...updatedData,
        };
        // Write the updated data back to the file
        await this.writeDataToFile(dataName, existingData);
        console.log(`Item with ID ${id} has been edited.`);
      } else {
        console.log(`Item with ID ${id} not found.`);
      }
    }
  }

  async addData(dataName, newData) {
    const existingData = await this.readDataFromFile(dataName);
    if (existingData) {
      existingData.push(newData);
      await this.writeDataToFile(dataName, existingData);
    }
  }

  async deleteDataById(id) {
    try {
      const dataItemToDelete = await this.findDataById(id);

      if (dataItemToDelete) {
        const date = new Date(dataItemToDelete.date);
        const dataName = `${date.getFullYear()}`;
        const data = await this.readDataFromFile(dataName);
        const newData = data.filter((item) => item.id !== id);
        await this.writeDataToFile(dataName, newData);

        console.log(`Item with id ${id} has been deleted.`);
        console.log(`Deleted item:`, dataItemToDelete);
        
        if (typeof window == "undefined") {
          console.log("Hell yeahhhhhhhhhhhhhh!")
          // location.href("/dash");
        }
      } else {
        console.log(`Item with id ${id} is already deleted.`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  async deleteUserById(id) {
    try {
      const dataItemToDelete = await this.findDataById(id);

      if (dataItemToDelete) {
        const data = await this.readDataFromFile("Users");
        const newData = data.filter((item) => item.id !== id);
        await this.writeDataToFile("Users", newData);

        console.log(`Item with id ${id} has been deleted.`);
        console.log(`Deleted item:`, dataItemToDelete);
        
        if (typeof window == "undefined") {
          console.log("Item is deleted successfully!")
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
        const dataName = file.slice(6, -5);
        const data = await this.readDataFromFile(dataName);

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
