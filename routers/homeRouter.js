const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile("Top");
    const allFathers = dataAccess.getDataFromJSONFile("Fathers");

    res.render("index.ejs", {
      arrTop: allData,
      arrFathers: allFathers,

      title: "St.George",
      description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "sorry something went wrong try again later",
    });
  }
});

module.exports = router;
