const express = require("express");
const router = express.Router();

// Schemas
const D2018 = require("../models/d2018Schema.js");
const D2019 = require("../models/d2019Schema.js");
const D2020 = require("../models/d2020Schema.js");
const D2021 = require("../models/d2021Schema.js");
const D2022 = require("../models/d2022Schema.js");
const D2023 = require("../models/d2023Schema.js");
const Top = require("../models/topSchema.js");

// Home route
router.get("/", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2018Data = await D2018.find();
    const d2019Data = await D2019.find();
    const d2020Data = await D2020.find();
    const d2021Data = await D2021.find();
    const d2022Data = await D2022.find();
    const d2023Data = await D2023.find();
    const TopData = await Top.find();

    res.render("index.ejs", {
      arr2018: d2018Data,
      arr2019: d2019Data,
      arr2020: d2020Data,
      arr2021: d2021Data,
      arr2022: d2022Data,
      arr2023: d2023Data,
      arrTop: TopData,

      title: "St.George",
      description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
