const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
require("dotenv").config();
const ejs = require("ejs");
const colors = "./middleware/colors.js";
const expressip = require("express-ip");
const dataAccess = require("./middleware/dataAccess");
const app = express();
const port = process.env.PORT;
const LD = process.env.LD;
const OD = process.env.OD;

// statics
app.use(express.json());
app.use(logger("dev"));
app.use(expressip().getIpInfoMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.static("public/images"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Import the Routers
const homeRouter = require("./routers/homeRouter");
const d2018Router = require("./routers/d2018Router");
const d2019Router = require("./routers/d2019Router");
const d2020Router = require("./routers/d2020Router");
const d2021Router = require("./routers/d2021Router");
const d2022Router = require("./routers/d2022Router");
const d2023Router = require("./routers/d2023Router");

// Routers
app.use("/", homeRouter);
app.use("/2018", d2018Router);
app.use("/2019", d2019Router);
app.use("/2020", d2020Router);
app.use("/2021", d2021Router);
app.use("/2022", d2022Router);
app.use("/2023", d2023Router);

app.use((req, res, next) => {
  res.status(404).render("404.ejs");
});

// server
app.listen(port, () => {
  console.log(
    `\x1b[32m[successfully]:\x1b[0m Server is running on http://localhost:${port}`
  );
});
