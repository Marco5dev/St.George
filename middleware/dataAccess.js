const fs = require("fs");
const path = require("path");

// Get data from a file
function getDataFromJSONFile(filename) {
  const filePath = path.join(__dirname, "../Data", `data.d${filename}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Update data in a file
function updateDataInJSONFile(filename, newData) {
  const filePath = path.join(__dirname, "../Data", `data.d${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
}

// Add new data to a file
function addDataToJSONFile(filename, newData) {
  const data = getDataFromJSONFile(filename);
  data.push(newData);
  updateDataInJSONFile(filename, data);
}

// Delete data from a file
function deleteDataFromJSONFile(filename, idToDelete) {
  const data = getDataFromJSONFile(filename);
  const newData = data.filter((item) => item._id.$oid !== idToDelete);
  updateDataInJSONFile(filename, newData);
}

// Get all data
function getAllData() {
  const dataFiles = fs.readdirSync(path.join(__dirname, "../Data"));
  const allData = [];

  dataFiles.forEach((file) => {
    const filename = file.replace(".json", "");
    const data = getDataFromJSONFile(filename);
    allData.push(data);
  });

  return allData;
}

module.exports = {
  getDataFromJSONFile,
  updateDataInJSONFile,
  addDataToJSONFile,
  deleteDataFromJSONFile,
  getAllData,
};
