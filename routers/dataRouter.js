const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const multer = require("multer");
const upload = require("../middleware/upload");
const uuid = require("uuid");
const path = require("path");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);

// Display all the website data
router.get("/", async (req, res) => {
  try {
    const allData = await  jsonDB.getAllData();

    const yearData = {};
    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

    for (const year of years) {
      yearData[`arr${year}`] = await  jsonDB.readDataFromFile(year);
    }

    res.render("data.ejs", {
      ...yearData,
      year: years,
      arrAll: allData,
      title: "all the data",
      description: "Here you can browse all the data in the website",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const blacklist = new Set(["data.dFathers.json", ""]);
  const allData = await jsonDB.getAllData();

  const yearData = {};
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

  for (const year of years) {
    yearData[`arr${year}`] = await jsonDB.readDataFromFile(year);
  }
  // DYNAMIC STORYS LINK

  jsonDB
    .findDataById(id)
    .then((result) => {
      res.render("data-1", {
        title: result.name,
        description: result.competition,
        item: result,
        ...yearData,
        arrAll: allData,
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
