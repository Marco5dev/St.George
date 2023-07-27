const express = require("express");
const router = express.Router();

// Schemas
const D2020 = require("../models/d2020Schema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    const d2020Data = await D2020.find();

    res.render("d2020.ejs", {
      arr2020: d2020Data,

      title: "2020 Data",
      description: "all data about year 2020",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
