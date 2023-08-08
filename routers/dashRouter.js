const express = require("express");
const router = express.Router();
const app = express();
const dataAccess = require("../middleware/dataAccess");
const expressip = require("express-ip");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });
const checkIPAddress = require("../middleware/getIP");

app.use(expressip().getIpInfoMiddleware);

// TODO: to display all the data of the website
router.get("/", checkIPAddress, (req, res) => {
  try {
    const allData = dataAccess.getAllData();
    const D2018 = dataAccess.getDataFromJSONFile(2018);
    const D2019 = dataAccess.getDataFromJSONFile(2019);
    const D2020 = dataAccess.getDataFromJSONFile(2020);
    const D2021 = dataAccess.getDataFromJSONFile(2021);
    const D2022 = dataAccess.getDataFromJSONFile(2022);
    const D2023 = dataAccess.getDataFromJSONFile(2023);
    const DTop = dataAccess.getDataFromJSONFile("Top");

    const Add = dataAccess.addDataToJSONFile();

    res.render("dash.ejs", {
      arrAll: allData,
      arr2018: D2018,
      arr2019: D2019,
      arr2020: D2020,
      arr2021: D2021,
      arr2022: D2022,
      arr2023: D2023,
      arrTop: DTop,
      title: "Dashboard",
      description: "Control all the data in the website add, edit, delete, etc",
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
