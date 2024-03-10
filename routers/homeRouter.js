const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const path = require("path");
const cookieParser = require("cookie-parser");

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

// Home route
router.get("/", async (req, res) => {
  try {
    const isPersistentLoggedIn = req.cookies["dashboard_login_persistent"] === "true";
    const dashboardLoginPersistentValue = req.cookies["dashboard_login_persistent"];

    const [d2021, d2022, fathersData] = await Promise.all([
      jsonDB.readDataFromFile("2021"),
      jsonDB.readDataFromFile("2022"),
      jsonDB.readDataFromFile("Fathers")
    ]);

    res.render("index.ejs", {
      adminName: res.locals.adminName,
      adminPerms: res.locals.perms,
      isPersistentLoggedIn,
      dashboardLoginPersistentValue,
      arr2021: d2021,
      arr2022: d2022,
      arrFathers: fathersData,
      title: "St.George",
      description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

module.exports = router;
