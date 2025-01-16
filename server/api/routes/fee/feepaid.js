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



// New endpoint for profile or verification
router.get("/", checkAuth, async (req, res) => {
  const { collection_by, payment_at, FeeStandard, fmonth, fyear } = req.query;

  let whereClauses = [];

  if (collection_by) {
      whereClauses.push(`f.collection_by = ?`);
  }

  if (payment_at) {
      whereClauses.push(`f.payment_at = ?`);
  }

  if (FeeStandard) {
      whereClauses.push(`f.FeeStandard = ?`);
  }

  if (fmonth) {
      whereClauses.push(`MONTH(f.payment_at) = ?`);
  }

  if (fyear) {
      whereClauses.push(`YEAR(f.payment_at) = ?`);
  }

  const query = `
    SELECT 
      f.idf, 
      f.fee_adm_no, 
      b.name, 
      f.FeeStandard,
      f.sec, 
      f.collection, 
      f.monthly_fee_feetbl AS total_fee, 
      f.collection_by, 
      f.payment_at,
      f.created_at,
      f.total_fee,
      f.total_collection,
      YEAR(f.payment_at) AS fyear,          -- Added fyear
      MONTH(f.payment_at) AS fmonth         -- Added fmonth
    FROM 
      fee_tbl f 
    JOIN 
      basicinfo b 
    ON 
      f.fee_adm_no = b.adm_no 
    WHERE 
      f.collection > 0
      ${whereClauses.length > 0 ? 'AND ' + whereClauses.join(' AND ') : ''}
  `;

  const values = [
      collection_by,
      payment_at,
      FeeStandard,
      fmonth,
      fyear
  ].filter(Boolean); // Removing any undefined or null values

  db.query(query, values, (error, result) => {
      if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ error: "Database query failed" });
      }

      return res.status(200).json({ success: true, data: result });
  });
});

  

module.exports = router;
