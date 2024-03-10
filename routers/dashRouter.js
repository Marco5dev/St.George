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


// security
router.post("/login", async (req, res) => {
  const enteredUsername = req.body.username;
  const enteredPassword = req.body.password;
  const rememberMe = req.body.remember === "on"; // Check if "Remember Me" is selected

  const usersFilePath = path.join(dataFolderPath, "data.dUsers.json");

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
        });

        // Find the user's id by matching the username
        const userId = users.find(
          (user) => user.username === enteredUsername
        ).id;

        res.cookie("dashboard-user", userId, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
        }); // Set a persistent cookie for "Remember Me" (30 days)
      } else {
        req.session.dashboard_login_session = true; // Set a session cookie for non-remembered login
      }
      if (req.originalUrl === "/dash") {
        res.redirect("/dash");
      } else {
        if (req.originalUrl === "/dash/login") {
          res.redirect("/dash");
        }
      }
      console.log("Access accepted");
    } else {
      console.log("pass is wrong");
      res.render("./admin/login-err.ejs", {
        errorMessage: "* Invalid username or password.", // Add this line
        title: "Login",
        description: "Please enter your credentials to access the dashboard.",
      });
    }
  } catch (error) {
    console.error("Error reading users file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// logout
router.get("/logout", (req, res) => {
  res.clearCookie("dashboard_login_persistent"); // Clear the persistent login cookie
  res.clearCookie("dashboard-user"); // Clear the username cookie
  req.session.destroy(); // Destroy the session

  // Redirect to the login page or any other desired page
  res.redirect("/");
});

// Display all the website data
router.get("/", (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    res.render("./admin/dash.ejs", {
      adminName: res.locals.adminName,
      isPersistentLoggedIn: isPersistentLoggedIn,
      dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
      title: "Dashboard St.George",
      description: "Add, Edit, Delete any data you want as admin",
    });
  } else {
    // User is not authenticated
    // Store the original URL in session
    req.session.originalUrl = req.originalUrl;
    res.render("./admin/login.ejs", {
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

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    // If there's a stored original URL, redirect to it
    if (req.session.originalUrl) {
      const originalUrl = req.session.originalUrl;
      req.session.originalUrl = null; // Clear the stored URL
      res.redirect(originalUrl);
    } else {
      try {
        res.render("./admin/add.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: "Add Data",
          description: "Add new data to the website",
        });
      } catch (err) {
        console.error(err);
        res.status(500).render("500-2.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
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
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const { name, social, rank, competition, date, edu } = req.body;

      const uniqueID = uuid.v4();
      const newData = {
        id: uniqueID,
        social,
        image: req.file.filename,
        name,
        rank,
        competition,
        date,
        edu,
      };

      let dataName = date;

      await jsonDB.addData(dataName, newData);

      res.redirect(`/dash`);
      console.log(req.file);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Add user
router.get("/add/user", (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    // If there's a stored original URL, redirect to it
    if (req.session.originalUrl) {
      const originalUrl = req.session.originalUrl;
      req.session.originalUrl = null; // Clear the stored URL
      res.redirect(originalUrl);
    } else {
      try {
        res.render("./admin/addUser.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: "Add New User",
          description: "Add new user to the website",
        });
      } catch (err) {
        console.error(err);
        res.status(500).render("500-2.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
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
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

router.post("/add/user", upload.single("image"), async (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const { name, email, username, mobile, password } = req.body;

      const uniqueID = uuid.v4();
      const newData = {
        id: uniqueID,
        name,
        email,
        username,
        mobile,
        password,
      };

      await jsonDB.addData("Users", newData);

      res.redirect(`/dash`);
      console.log(req.file);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("login.ejs", {
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

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const result = await jsonDB.findDataById(id);

      if (result) {
        res.render("data-1.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: result.name,
          description: result.competition,
          item: result,
        });
      } else {
        res.status(404).render("404.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: "Not Found",
          description: "Sorry, the requested data was not found.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Delete data by ID
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      await jsonDB.findDataById(id).then((data) => {
        fs.unlink(__dirname + "/../uploads" + data.image, function() {
          res.send ({
            status: "200",
            responseType: "string",
            response: "success"
          });     
        });
        
      })
      await jsonDB.deleteDataById(id);
      res.status(200).json({ status: "success" });
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting data");
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
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

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      const result = await jsonDB.findDataById(id);

      if (result) {
        res.render("./admin/edit.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: "Edit Data",
          description: "Edit the selected data item",
          item: result,
        });
      } else {
        res.status(404).render("404.ejs", {
          adminName: res.locals.adminName,
          isPersistentLoggedIn: isPersistentLoggedIn,
          dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
          title: "Not Found",
          description: "Sorry, the requested data was not found.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue, // Pass the value to the view
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Edit data by ID
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { name, social, rank, competition, date, edu } = req.body;
  const dataName = req.body.date;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");

    try {
      const existingData = await jsonDB.findDataById(id);

      const updatedData = {
        social,
        name,
        rank,
        competition,
        date,
        edu,
      };

      if (req.file) {
        // If a new image is uploaded, use it
        updatedData.image = req.file.filename;
      } else {
        // If no new image is uploaded, use the existing image
        updatedData.image = existingData.image;
      }

      await jsonDB.editData(id, dataName, updatedData);
      res.redirect(`/dash`);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue,
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Edit data by ID
router.get("/edit/user/:userId", async (req, res) => {
  const userId = req.cookies["dashboard-user"];
  const dataName = "Users";

  if (!userId) {
    // Handle the case when the user ID is not available
    res.status(400).send("User ID not found.");
    return;
  }

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      jsonDB
        .findDataById(userId)
        .then((result) => {
          res.render("./admin/editUser.ejs", {
            adminName: res.locals.adminName,
            isPersistentLoggedIn: isPersistentLoggedIn,
            dashboardLoginPersistentValue: dashboardLoginPersistentValue,
            title: "Edit User Data",
            description: "Edit the User data",
            item: result,
            userId,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).render("500-2.ejs", {
            adminName: res.locals.adminName,
            isPersistentLoggedIn: isPersistentLoggedIn,
            dashboardLoginPersistentValue: dashboardLoginPersistentValue,
            title: "500 Internal server error",
            description: "Sorry, something went wrong. Please try again later.",
          });
        });
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue,
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

router.post("/edit/user/:userId", upload.single("image"), async (req, res) => {
  const userId = req.cookies["dashboard-user"];
  const dataName = "Users";

  if (!userId) {
    // Handle the case when the user ID is not available
    res.status(400).send("User ID not found.");
    return;
  }
  const { name, email, username, mobile, password } = req.body;

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");

    try {
      const { name, email, username, mobile, password } = req.body;

      const uniqueID = uuid.v4();
      const updatedData = {
        name,
        email,
        username,
        mobile,
        password,
      };
      const dataName = "Users";
      await jsonDB.editData(userId, dataName, updatedData);
      res.redirect(`/dash`);
    } catch (err) {
      console.error(err);
      res.status(500).render("500-2.ejs", {
        adminName: res.locals.adminName,
        isPersistentLoggedIn: isPersistentLoggedIn,
        dashboardLoginPersistentValue: dashboardLoginPersistentValue,
        title: "500 Internal server error",
        description: "Sorry, something went wrong. Please try again later.",
      });
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

// Delete data by ID
router.delete("/edit/user/:userId", async (req, res, next) => {
  const userId = req.cookies["dashboard-user"];
  const dataName = "Users";

  if (!userId) {
    // Handle the case when the user ID is not available
    res.status(400).send("User ID not found.");
    return;
  }

  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;

  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

  if (isPersistentLoggedIn || isSessionLoggedIn) {
    console.log("User is authenticated");
    try {
      await jsonDB.deleteUserById(userId);
      res.status(200).json({ status: "success" });
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while deleting data");
    }
  } else {
    // User is not authenticated
    res.render("./admin/login.ejs", {
      title: "Login",
      description: "Please enter your credentials to access the dashboard.",
    });
  }
});

module.exports = router;
