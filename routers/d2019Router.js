const express = require("express");
const router = express.Router();

// Schemas
const D2019 = require("../models/d2019Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2019Data = await D2019.find();

    res.render("d2019.ejs", {
      arr2019: d2019Data,

      title: "2019 Data",
      description: "all data about year 2019",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
