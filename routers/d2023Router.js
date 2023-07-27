const express = require("express");
const router = express.Router();

// Schemas
const D2023 = require("../models/d2023Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2023Data = await D2023.find();

    res.render("d2023.ejs", {
      arr2023: d2023Data,

      title: "2023 Data",
      description: "all data about year 2023",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
