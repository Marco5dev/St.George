const express = require("express");
const router = express.Router();

// Schemas
const D2021 = require("../models/d2021Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2021Data = await D2021.find();

    res.render("d2021.ejs", {
      arr2021: d2021Data,

      title: "2021 Data",
      description: "all data about year 2021",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
