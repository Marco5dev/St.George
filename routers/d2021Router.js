const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile(2021);

    res.render("d2021.ejs", {
      arr2021: allData,

      title: "2021 Data",
      description: "all data about year 2021",
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500.ejs", {
      title: "There is no data for this year",
      description: "sorry we couldn't find any data for this year",
    });
  }
});

module.exports = router;
