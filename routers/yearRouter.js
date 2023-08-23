const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const path = require("path");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);

// Route handler for different years
const yearRoutes = [
  { year: 2018, title: "2018 Data", description: "all data about year 2018" },
  { year: 2019, title: "2019 Data", description: "all data about year 2019" },
  { year: 2020, title: "2020 Data", description: "all data about year 2020" },
  { year: 2021, title: "2021 Data", description: "all data about year 2021" },
  { year: 2022, title: "2022 Data", description: "all data about year 2022" },
  { year: 2023, title: "2023 Data", description: "all data about year 2023" },
];

yearRoutes.forEach((route) => {
  router.get(`/${route.year}`, async (req, res) => {
    jsonDB
      .readDataFromFile(route.year)
      .then((result) => {
        res.render(`yearData.ejs`, {
          arr: result,
          title: route.title,
          description: route.description,
          year: route.year,
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
});

module.exports = router;
