const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const multer = require("multer");
const upload = require("../middleware/upload");
const uuid = require("uuid");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs").promises;

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);
const COOKIE_NAME = "dashboard_access";

// Middleware to load common data for rendering views
router.use(async (req, res, next) => {
  try {
    const allData = await jsonDB.getAllData();

    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years
    const yearDataPromises = years.map(async (year) => {
      return jsonDB.readDataFromFile(year);
    });
    const yearData = await Promise.all(yearDataPromises);

    res.locals.yearData = yearData.reduce((accumulator, data, index) => {
      accumulator[`arr${years[index]}`] = data;
      return accumulator;
    }, {});

    res.locals.years = years;
    res.locals.arrAll = allData;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

// security
router.post("/login", async (req, res) => {
  const enteredUsername = req.body.username;
  const enteredPassword = req.body.password;
  const rememberMe = req.body.remember === "on"; // Check if "Remember Me" is selected

  const usersFilePath = path.join(dataFolderPath, "data.dAdmin.json");

  try {
    const usersData = await fs.readFile(usersFilePath, "utf8");
    const users = JSON.parse(usersData);

    const validUser = users.find(
      (user) =>
        user.username === enteredUsername && user.password === enteredPassword
    );

    if (validUser) {
      if (rememberMe) {
        res.cookie("dashboard_login_persistent", "true", {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        }); // Set a persistent cookie for "Remember Me" (30 days)
      } else {
        req.session.dashboard_login_session = true; // Set a session cookie for non-remembered login
      }
      if (req.originalUrl === "/dash") {
        res.redirect("/dash")
      } else {
        if (req.originalUrl === "/dash/login") {
          res.redirect("/dash/add")
        }
      }
      console.log("Access accepted");
    } else {
      console.log("pass is wrong");
      res.render("loginForm.ejs", {
        title: "Login",
        description: "Incorrect credentials. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error reading users file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Display all the website data
router.get("/", (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    // If there's a stored original URL, redirect to it

    res.render("dash.ejs", {
      title: "All the Data",
      description: "Browse all the data on the website",
    });
  } else {
    // User is not authenticated
    // Store the original URL in session
    req.session.originalUrl = req.originalUrl;
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Add data
router.get("/add", (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    // If there's a stored original URL, redirect to it
    if (req.session.originalUrl) {
      const originalUrl = req.session.originalUrl;
      req.session.originalUrl = null; // Clear the stored URL
      res.redirect(originalUrl);
    } else {
      try {
        res.render("add.ejs", {
          title: "Add Data",
          description: "Add new data to the website",
        });
      } catch (err) {
        console.error(err);
        res.status(500).render("500-2.ejs", {
          title: "500 Internal server error",
          description: "Sorry, something went wrong. Please try again later.",
        });
      }
    }
  } else {
    // User is not authenticated
    console.log("Sorry try again");
    // Store the original URL in session
    req.session.originalUrl = req.originalUrl;
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const { dataName, name, social, rank, competition, date, edu } = req.body;

      const uniqueID = uuid.v4();
      const newData = {
        id: uniqueID,
        social,
        image: req.file.dataName,
        name,
        rank,
        competition,
        date,
        edu,
      };

      await jsonDB.addData(dataName, newData);

      res.redirect(`/dash`);
      console.log(req.file);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Display dynamic data
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const result = await jsonDB.findDataById(id);

      if (result) {
        res.render("data-1", {
          title: result.name,
          description: result.competition,
          item: result,
        });
      } else {
        res.status(404).render("404.ejs", {
          title: "Not Found",
          description: "Sorry, the requested data was not found.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Delete data by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      await jsonDB.deleteDataById(id);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting data");
    }
  } else {
    // User is not authenticated
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Edit data by ID
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const result = await jsonDB.findDataById(id);

      if (result) {
        res.render("edit.ejs", {
          title: "Edit Data",
          description: "Edit the selected data item",
          item: result,
        });
      } else {
        res.status(404).render("404.ejs", {
          title: "Not Found",
          description: "Sorry, the requested data was not found.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Edit data by ID
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { name, social, rank, competition, date, edu } = req.body;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");

    const newData = {
      social,
      image: req.file.filename,
      name,
      rank,
      competition,
      date,
      edu,
    };

    const updatedData = newData;

    try {
      await jsonDB.editData(id, updatedData);
      res.redirect(`/dash/${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("loginForm.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

module.exports = router;
