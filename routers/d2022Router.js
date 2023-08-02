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
    res.status(500).render("500.ejs");
  }
});

module.exports = router;
