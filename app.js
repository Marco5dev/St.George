const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const multer = require("multer");
const expressip = require("express-ip");
const ejs = require("ejs");
const axios = require("axios");
const opn = require("opn");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const JSONDatabase = require("./middleware/dataAccess/dataAccess");
const dataFolderPath = path.join(__dirname, "./Data");
const jsonDB = new JSONDatabase(dataFolderPath);
require("dotenv").config();

// Import middleware and routers
const colors = require("./middleware/colors");
const homeRouter = require("./routers/homeRouter");
const dashRouter = require("./routers/dashRouter");
const dataRouter = require("./routers/dataRouter");
const yearRouter = require("./routers/yearRouter");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(logger("dev"));
app.use(expressip().getIpInfoMiddleware);
app.use(cookieParser());
app.use(
  session({
    secret: "Marco#060928060328", 
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname);
  },
});

const upload = multer({ storage });

// Routers
app.use("/", homeRouter);
app.use("/dash", dashRouter);
app.use("/data", dataRouter);
app.use("/year", yearRouter); 

// 404 Handler
app.use(async (req, res) => {
  const isPersistentLoggedIn =
    req.cookies["dashboard_login_persistent"] === "true";
  const isSessionLoggedIn = req.session.dashboard_login_session === true;
  // Determine the value of the "dashboard_login_persistent" cookie
  const dashboardLoginPersistentValue =
    req.cookies["dashboard_login_persistent"];

    const adminCookie = req.cookies["dashboard-user"],
    adminID = await jsonDB.findDataById(adminCookie);

  res.status(404).render("404.ejs", {
    adminName: res.locals.adminName,
    adminPerms: adminID.perms,
    adminImage: adminID.image,
    isPersistentLoggedIn: isPersistentLoggedIn,
    isSessionLoggedInValue: isSessionLoggedIn,
    dashboardLoginPersistentValue: dashboardLoginPersistentValue,
    title: "404 Not Found",
    description: "Sorry, we couldn't find that page.",
  });
});

// Server
app.listen(port, () => {
  console.log(
    `\x1b[32m[successfully]:\x1b[0m Server is running on http://localhost:${port}`
  );
});
