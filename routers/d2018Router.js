const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const path = require("path");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);

// Home route
router.get("/", async (req, res) => {
  jsonDB
    .readDataFromFile(2018)
    .then((result) => {
      res.render("d2023.ejs", {
        arr: result,
        title: "2018 Data",
        description: "all data about year 2018",
        year: 2018,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    });
});

module.exports = router;
