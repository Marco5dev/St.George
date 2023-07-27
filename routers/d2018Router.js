const express = require("express");
const router = express.Router();

// Schemas
const D2018 = require("../models/d2018Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2018Data = await D2018.find();

    res.render("d2018.ejs", {
      arr2018: d2018Data,

      title: "2018 Data",
      description: "all data about year 2018",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
