const express = require("express");
const router = express.Router();
const JSONDatabase = require("../middleware/dataAccess/dataAccess");
const multer = require("multer");
const upload = require("../middleware/upload");
const uuid = require("uuid");
const path = require("path");
const readline = require("readline");

const dataFolderPath = path.join(__dirname, "../Data");
const jsonDB = new JSONDatabase(dataFolderPath);

// Create a readline interface for reading from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define the password you want to use for authentication
const correctPassword = process.env.PASS; // Change this to your desired password

// Middleware to check for password before allowing access
const checkPassword = (req, res, next) => {
  rl.question("Please enter the password: ", (password) => {
    if (password === correctPassword) {
      next(); // Password is correct, allow access
    } else {
      res.status(404).render("404.ejs", {
        title: "404 Not Found",
        description: "sorry we couldn't find that page",
      }); // Password is incorrect, deny access
    }
  });
};

// Display all the website data
router.get("/", checkPassword, async (req, res) => {
  try {
    const allData = await jsonDB.getAllData();

    const yearData = {};
    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

    for (const year of years) {
      yearData[`arr${year}`] = await jsonDB.readDataFromFile(year);
    }

    res.render("dash.ejs", {
      ...yearData,
      year: years,
      arrAll: allData,
      title: "all the data",
      description: "Here you can browse all the data in the website",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

router.get("/add", checkPassword, async (req, res, next) => {
  try {
    const allData = await jsonDB.getAllData();

    const yearData = {};
    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

    for (const year of years) {
      yearData[`arr${year}`] = await jsonDB.readDataFromFile(year);
    }

    res.render("add.ejs", {
      ...yearData,
      year: years,
      arrAll: allData,
      title: "all the data",
      description: "Here you can browse all the data in the website",
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

// Add data
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { filename, name, social, rank, competition, date, edu } = req.body;

    // Generate a random unique ID
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

    await jsonDB.addData(filename, newData);

    res.redirect(`/dash`); // Redirect to the data display page
    console.log(req.file);
  } catch (err) {
    console.error(err);
    res.status(500).render("500-2.ejs", {
      title: "500 Internal server error",
      description: "Sorry, something went wrong. Please try again later.",
    });
  }
});

// dynamic dash data
router.get("/:id", checkPassword, async (req, res) => {
  const id = req.params.id;

  const blacklist = new Set(["data.dFathers.json", ""]);
  const allData = await jsonDB.getAllData();

  const yearData = {};
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "Top"]; // Update with your years

  for (const year of years) {
    yearData[`arr${year}`] = await jsonDB.readDataFromFile(year);
  }

  try {
    const result = await jsonDB.findDataById(id);

    if (result) {
      res.render("data-1", {
        title: result.name,
        description: result.competition,
        item: result,
        ...yearData,
        arrAll: allData,
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
});

// Delete data by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  jsonDB
    .deleteDataById(id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err); // Log the error to the console
      res.status(500).send("An error occurred while deleting data");
    });
});

module.exports = router;
