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



router.get("/:admNo", async (req, res) => {
  const { admNo } = req.params;
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const sql = `
    SELECT fee_tbl.*, basicinfo.*
    FROM fee_tbl
    JOIN basicinfo ON fee_tbl.fee_adm_no = basicinfo.adm_no
    WHERE fee_tbl.fee_adm_no = ? AND fee_tbl.fyear = ? AND fee_tbl.fmonth = ?
  `;

  db.query(sql, [admNo, currentYear, currentMonth], (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No invoice data found" });
    }

    return res.status(200).json({ success: true, data: result[0] });
  });
});
  
module.exports = router;
