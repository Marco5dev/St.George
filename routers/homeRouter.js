const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const path = require("path");
const cookieParser = require("cookie-parser");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);


// Home route
router.get("/", (req, res) => {

  const isPersistentLoggedIn =
req.cookies["dashboard_login_persistent"] === "true";
const isSessionLoggedIn = req.session.dashboard_login_session === true;

  jsonDB
    .readDataFromFile("Top")
    .then((topData) => {
      jsonDB
        .readDataFromFile("Fathers")
        .then((fathersData) => {
          res.render("index.ejs", {
            adminName: req.cookies["dashboard-user"],
            isPersistentLoggedIn: isPersistentLoggedIn,
            arrTop: topData,
            arrFathers: fathersData,
            title: "St.George",
            description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
          });
        })
        .catch((fathersErr) => {
          console.log(fathersErr);
          res.status(500).render("500-2.ejs", {
            title: "500 Internal server error",
            description: "sorry something went wrong try again later",
          });
        });
    })
    .catch((topErr) => {
      console.log(topErr);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "sorry something went wrong try again later",
      });
    });
});

module.exports = router;
