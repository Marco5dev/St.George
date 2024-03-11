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

// Route handler for different years
const yearRoutes = [
  { year: 2018, title: "2018 Data", description: "all data about year 2018" },
  { year: 2019, title: "2019 Data", description: "all data about year 2019" },
  { year: 2020, title: "2020 Data", description: "all data about year 2020" },
  { year: 2021, title: "2021 Data", description: "all data about year 2021" },
  { year: 2022, title: "2022 Data", description: "all data about year 2022" },
  { year: 2023, title: "2023 Data", description: "all data about year 2023" },
];

yearRoutes.forEach((route) => {
  router.get(`/${route.year}`, async (req, res) => {
    const isPersistentLoggedIn =
      req.cookies["dashboard_login_persistent"] === "true";
    const isSessionLoggedIn = req.session.dashboard_login_session === true;

    // Determine the value of the "dashboard_login_persistent" cookie
    const dashboardLoginPersistentValue =
      req.cookies["dashboard_login_persistent"];

      const adminCookie = req.cookies["dashboard-user"],
    adminID = await jsonDB.findDataById(adminCookie);

    jsonDB
      .readDataFromFile(route.year)
      .then((result) => {
        res.render(`yearData.ejs`, {
          adminName: res.locals.adminName,
          adminPerms: adminID.perms,
          adminImage: adminID.image,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          arr: result,
          title: route.title,
          description: route.description,
          year: route.year,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).render("500-2.ejs", {
          adminName: res.locals.adminName,
          adminPerms: res.locals.perms,
          isPersistentLoggedIn: isPersistentLoggedIn,
          title: "500 Internal server error",
          description: "Sorry, something went wrong. Please try again later.",
        });
      });
  });
});

module.exports = router;
