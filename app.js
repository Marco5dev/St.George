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
  .connect(LD, { useNewUrlParser: true })
  .then(() =>
    console.log("\x1b[32m[successfully]:\x1b[0m Connected to local MongoDB")
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

app.get("/test", async (req, res) => {
  try {
    // Perform multiple Mongoose operations
    const d2018Data = await D2018.find();
    const d2019Data = await D2019.find();
    const d2020Data = await D2020.find();
    const d2021Data = await D2021.find();
    const d2022Data = await D2022.find();
    const d2023Data = await D2023.find();
    const TopData = await Top.find();

    res.render("dashboard.ejs", {
      arr2018: d2018Data,
      arr2019: d2019Data,
      arr2020: d2020Data,
      arr2021: d2021Data,
      arr2022: d2022Data,
      arr2023: d2023Data,
      arrTop: TopData,

      title: "St.George",
      description: "صفحه كنيسه الشهيد العظيم مارجرجس ببورسعيد",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// server
app.listen(port, () => {
  console.log(
    `\x1b[32m[successfully]:\x1b[0m Server is running on http://localhost:${port}`
  );
});
