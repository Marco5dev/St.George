const express = require("express");
const router = express.Router();

// Schemas
const D2022 = require("../models/d2022Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2022Data = await D2022.find();

    res.render("d2022.ejs", {
      arr2022: d2022Data,

      title: "2022 Data",
      description: "all data about year 2022",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
