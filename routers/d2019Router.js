const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile(2019);

    res.render("d2019.ejs", {
      arr2019: allData,

      title: "2019 Data",
      description: "all data about year 2019",
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
