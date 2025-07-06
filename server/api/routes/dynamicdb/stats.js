const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});


// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
});
 
// Fetch total purchase cost from goat_tbl
router.get("/purchase_cost", checkAuth, (req, res) => {
  const query = "SELECT SUM(CAST(cost AS DECIMAL(10,2))) AS total_purchase_cost FROM goat_tbl WHERE status = 'Active' OR status = 'Sold Out' OR status = 'Slaughterd'"; // Adjust statuses as needed
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching purchase cost:", error);
      return res.status(500).json({ error: "Failed to fetch purchase cost" });
    }
    res.json({ totalPurchaseCost: result[0].total_purchase_cost || 0 });
  });
});

// Fetch total expense amount from expense_tbl
router.get("/expenses/total", checkAuth, (req, res) => {
  const query = "SELECT SUM(CAST(amount AS DECIMAL(10,2))) AS total_expense FROM expense_tbl";
  db.query(query, (error, result) => {
    if (error) {
      console.error("Error fetching total expense:", error);
      return res.status(500).json({ error: "Failed to fetch total expense" });
    }
    res.json({ totalExpense: result[0].total_expense || 0 });
  });
});



module.exports = router;