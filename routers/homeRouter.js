const express = require("express");
const router = express.Router();
const dataAccess = require("../middleware/dataAccess");

// Home route
router.get("/", async (req, res) => {
  try {
    const allData = dataAccess.getDataFromJSONFile("Top");

    res.render("index.ejs", {
      arrTop: allData,

      title: "St.George",
      description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
