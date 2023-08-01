const fs = require('fs');
const path = require('path');

function getDataFromJSONFile(filename) {
  const filePath = path.join(__dirname, '../Data', `data.d${filename}.json`);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function getAllData() {
  const dataFiles = fs.readdirSync(path.join(__dirname, '../Data'));
  const allData = [];

  dataFiles.forEach((file) => {
    const filename = file.replace('.json', '');
    const data = getDataFromJSONFile(filename);
    allData.push(data);
  });

  return allData;
}

module.exports = {
  getDataFromJSONFile,
  getAllData,
};