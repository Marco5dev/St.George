const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile(2020);

    res.render("d2020.ejs", {
      arr2020: allData,

      title: "2020 Data",
      description: "all data about year 2020",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
