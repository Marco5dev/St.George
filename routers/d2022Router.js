const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile(2022);

    res.render("d2022.ejs", {
      arr2022: allData,

      title: "2022 Data",
      description: "all data about year 2022",
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
