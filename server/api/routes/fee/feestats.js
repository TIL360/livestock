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
 

router.get("/students/count", checkAuth, (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM basicinfo WHERE status = 'active'";
  db.query(query, (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    // Access the count from result[0].count
    return res.status(200).json({ count: result[0].count });
  });
});

router.get("/expensehead", checkAuth, (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript
  const feedetailQuery = `
      SELECT 
          expense_tbl.year,
          expense_tbl.month,
          SUM(expense_tbl.amount) AS total_expense
      FROM 
          expense_tbl
      WHERE year = ? AND
            month = ?
  `;

  db.query(feedetailQuery, [currentYear, currentMonth], (error, result) => {
      if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ error: "Database query failed" });
      }

      return res.status(200).json({ success: true, data: result[0] });
  });
});


router.get("/mainhead", checkAuth, (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript
    const feedetailQuery = `
        SELECT 
            fee_tbl.fyear,
            fee_tbl.fmonth,
            SUM(fee_tbl.total_fee) AS total_fee,
            SUM(fee_tbl.total_arrears) AS total_arrears,
            SUM(fee_tbl.total_collection) AS total_collection,
            (SUM(fee_tbl.total_fee) - SUM(fee_tbl.total_collection)) AS total_balance,
            SUM(fee_tbl.collection) AS collection,
            SUM(fee_tbl.monthly_fee_feetbl) AS monthly_fee_feetbl,
            SUM(fee_tbl.fine_fee) AS fine_fee,
            SUM(fee_tbl.fine_arrears) AS fine_arrears,
            SUM(fee_tbl.fine_collection) AS fine_collection,
            SUM(fee_tbl.adm_fee) AS adm_fee,
            SUM(fee_tbl.adm_arrears) AS adm_arrears,
            SUM(fee_tbl.adm_collection) AS adm_collection,
            SUM(fee_tbl.exam_fee) AS exam_fee,
            SUM(fee_tbl.exam_arrears) AS exam_arrears,
            SUM(fee_tbl.exam_collection) AS exam_collection,
            SUM(fee_tbl.misc_fee) AS misc_fee,
            SUM(fee_tbl.misc_arrears) AS misc_arrears,
            SUM(fee_tbl.misc_collection) AS misc_collection
        FROM 
            fee_tbl
        WHERE fyear = ? AND
              fmonth = ?
    `;

    db.query(feedetailQuery, [currentYear, currentMonth], (error, result) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        return res.status(200).json({ success: true, data: result[0] });
    });
});



router.get("/reporting", checkAuth, (req, res) => {
 const reportQuery = `
  SELECT 
    fee_tbl.fyear, 
    fee_tbl.fmonth, 
    SUM(fee_tbl.total_fee) AS total_fee,
    SUM(fee_tbl.total_collection) AS total_collection, 
    SUM(fee_tbl.collection) AS collection, 
    SUM(fee_tbl.monthly_fee_feetbl) AS monthly_fee_feetbl, 
    SUM(fee_tbl.fine_fee) AS fine_fee, 
    SUM(fee_tbl.fine_collection) AS fine_collection, 
    SUM(fee_tbl.adm_fee) AS adm_fee, 
    SUM(fee_tbl.adm_collection) AS adm_collection, 
    SUM(fee_tbl.exam_fee) AS exam_fee, 
    SUM(fee_tbl.exam_collection) AS exam_collection, 
    SUM(fee_tbl.misc_fee) AS misc_fee, 
    SUM(fee_tbl.misc_collection) AS misc_collection 
  FROM 
    fee_tbl 
  GROUP BY 
    fee_tbl.fyear, 
    fee_tbl.fmonth 
  ORDER BY 
    fee_tbl.fyear DESC, 
    fee_tbl.fmonth DESC
`;

  db.query(reportQuery, (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.status(200).json({ success: true, data: result });
  });
});

router.get("/salary", checkAuth, (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript
  const salaryQuery = `
      SELECT 
          SUM(salary_tbl.net_salary) AS total_net_salary
      FROM 
          salary_tbl
      WHERE year = ? AND
            month = ?
  `;

  db.query(salaryQuery, [currentYear, currentMonth], (error, result) => {
      if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ error: "Database query failed" });
      }

      return res.status(200).json({ success: true, data: result[0] });
  });
});



module.exports = router;