# JSONDatabase Middleware

The `JSONDatabase` middleware provides a utility for managing JSON data files in a structured manner. It offers methods to read, write, update, and delete data in JSON files, allowing easy interaction with your application's data storage.

## Installation

To use the `JSONDatabase` middleware, you need to include the provided class in your project. You can copy the class definition from the provided source code and save it as `JSONDatabase.js` in your project directory.

## Usage

```javascript
// Import required modules and setup express router
const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/JSONDatabase"); // Update path as needed
const path = require("path");

// Specify the data folder path
const dataFolderPath = path.join(__dirname, "../Data");

// Initialize the JSONDatabase instance
const jsonDB = new JSONDatabase(dataFolderPath);

// Display all the website data
router.get("/", async (req, res) => {
  try {
    const allData = await jsonDB.getAllData();
    // ... (rendering logic)
  } catch (err) {
    // ... (error handling)
  }
});

// Add data
// the upload is multer package to upload photos set it up as you like and use it as you like
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { filename, name, social, rank, competition, date, edu } = req.body;
    // Generate a random unique ID
    const uniqueID = uuid.v4();
    const newData = {
      id: uniqueID,
      social,
      image: req.file.filename,
      name,
      rank,
      competition,
      date,
      edu,
    };
    await jsonDB.addData(filename, newData);
    // ... (redirect or response)
  } catch (err) {
    // ... (error handling)
  }
});

// Get data by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await jsonDB.findDataById(id);
    if (result) {
      // ... (rendering logic)
    } else {
      // ... (not found logic)
    }
  } catch (err) {
    // ... (error handling)
  }
});

// Delete data by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await jsonDB.deleteDataById(id);
    // ... (response or redirect)
  } catch (err) {
    // ... (error handling)
  }
});

module.exports = router;
