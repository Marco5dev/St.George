const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile(2023);

    res.render("d2023.ejs", {
      arr2023: allData,

      title: "2023 Data",
      description: "all data about year 2023",
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500.ejs");
  }
});

module.exports = router;
