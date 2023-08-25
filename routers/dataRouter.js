const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const path = require("path");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);

// Middleware to load common data for rendering views
router.use(async (req, res, next) => {
  try {
    const adminId = req.cookies["dashboard-user"];
    if (adminId) {
      const userData = await jsonDB.findDataById(adminId);
      if (userData) {
        res.locals.adminName = userData.name;
      }
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

// Middleware to load common data for rendering views
router.use(async (req, res, next) => {
  try {
    const isPersistentLoggedIn = req.cookies["dashboard_login_persistent"] === "true";
    const dashboardLoginPersistentValue = req.cookies["dashboard_login_persistent"];
    const allData = await jsonDB.getAllData();
    
    const yearData = await Promise.all(years.map(async year => ({
      [`arr${year}`]: await jsonDB.readDataFromFile(year)
    })));
    
    res.locals = {
      adminName: res.locals.adminName,
      isPersistentLoggedIn,
      dashboardLoginPersistentValue,
      ...yearData.reduce((acc, data) => ({ ...acc, ...data }), {}),
      years,
      arrAll: allData
    };
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      adminName: res.locals.adminName,
      isPersistentLoggedIn: req.cookies["dashboard_login_persistent"] === "true",
      dashboardLoginPersistentValue: req.cookies["dashboard_login_persistent"],
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later."
    });
  }
});

// Display all the website data
router.get("/", async (req, res) => {
  try {
    res.render("data.ejs", {
      title: "all the data",
      description: "Here you can browse all the data in the website"
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later."
    });
  }
});

// Display dynamic data
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blacklist = new Set(["data.dFathers.json", ""]);
    const allData = await jsonDB.getAllData();
    
    const result = await jsonDB.findDataById(id);
    
    if (!result) {
      throw new Error("Data not found");
    }
    
    res.render("data-1", {
      title: result.name,
      description: result.competition,
      item: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later."
    });
  }
});

module.exports = router;
