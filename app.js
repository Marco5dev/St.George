const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
require("dotenv").config();
const ejs = require("ejs");
const colors = "colors.js";
const expressip = require("express-ip");
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

// mongoose
mongoose
  .connect(OD)
  .then(() =>
    console.log("\x1b[32m[successfully]:\x1b[0m Connected to MongoDB")
  )
  .catch((err) => {
    console.log("\x1b[31m[Error]:\x1b[0m " + err);
  });

// Schemas
const D2018 = require("./models/d2018Schema.js");
const D2019 = require("./models/d2019Schema.js");
const D2020 = require("./models/d2020Schema.js");
const D2021 = require("./models/d2021Schema.js");
const D2022 = require("./models/d2022Schema.js");
const D2023 = require("./models/d2023Schema.js");
const Top = require("./models/topSchema.js");

// Routers
app.use("/", homeRouter);
app.use("/d2018", d2018Router);
app.use("/d2019", d2019Router);
app.use("/d2020", d2020Router);
app.use("/d2021", d2021Router);
app.use("/d2022", d2022Router);
app.use("/d2023", d2023Router);

// server
app.listen(port, () => {
  console.log(
    `\x1b[32m[successfully]:\x1b[0m Server is running on http://localhost:${port}`
  );
});
