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
    f.collection, 
    f.total_fee, 
    f.monthly_fee_feetbl, 
    f.collection_by,  
    f.total_arrears, 
    f.payment_at,
    f.created_at,
    f.fyear,
    f.fmonth
  FROM 
    fee_tbl f 
  JOIN 
    basicinfo b 
  ON 
    f.fee_adm_no = b.adm_no 
  WHERE 
    f.collection = 0
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

router.patch("/examfee", checkAuth, async (req, res) => {
  try {
    const { standard, examFee } = req.body;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const query = `
      UPDATE fee_tbl 
      SET exam_fee = ? 
      WHERE FeeStandard = ? AND fyear = ? AND fmonth = ?
    `;
    const values = [examFee, standard, year, month];

    const result = await db.query(query, values);

    // Check if the update was successful
    if (result.affectedRows === 0 && result.changedRows === 0) {
      return res.status(404).json({ error: "No record found for update or record already up-to-date" });
    } else {
      return res.status(200).json({ message: "Exam fee updated successfully" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Database query failed" });
  }
});




//update misc fee with remarks
router.patch("/miscfee", checkAuth, async (req, res) => {
  try {
    const { standard, miscFee, remarks } = req.body;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const query = `
      UPDATE fee_tbl 
      SET misc_fee = ?, remarks = ? 
      WHERE FeeStandard = ? AND fyear = ? AND fmonth = ?
    `;
    const values = [miscFee, remarks, standard, year, month];
    const result = await db.query(query, values);

    // Check if the update was successful
    if (result.affectedRows === 0 && result.changedRows === 0) {
      return res.status(404).json({ error: "No record found for update or record already up-to-date" });
    } else {
      return res.status(200).json({ message: "Misc fee updated successfully" });
    }
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({ error: "Database query failed" });
  }
});

router.get("/search", checkAuth, async (req, res) => {
  const { query } = req.query;

  // Log the values for debugging
  console.log("Search Query:", query);
  
  // Return error if query is not provided
  if (!query) {
    return res.status(400).json({ error: "Please provide a search query." });
  }

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1; // Handle wrap around to January
  const yearForNextMonth = nextMonth === 1 ? currentYear + 1 : currentYear; // Increment year if next month is January

  const sql = `
    SELECT fee_tbl.*, basicinfo.*
    FROM fee_tbl
    JOIN basicinfo ON fee_tbl.fee_adm_no = basicinfo.adm_no 
    WHERE 
      fee_tbl.fee_adm_no = ? AND
      fee_tbl.fyear = ? AND
      (fee_tbl.fmonth = ? OR fee_tbl.fmonth = ?)
  `;
  
  const values = [query, currentYear, currentMonth, nextMonth];

  // Execute the SQL query
  db.query(sql, values, (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  });
});




router.patch('/misc/:idf', checkAuth, async (req, res) => {
  const { miscfee, remarks } = req.body; // No need to expect total_fee anymore
  const idf = req.params.idf;

  if (!miscfee || !remarks) { // Adjusted the condition to only check for miscfee and remarks
    return res.status(400).json({ error: "Misc fee and remarks are required." });
  }

  try {
    const query = `
      UPDATE fee_tbl 
      SET misc_fee = ?, remarks = ?
      WHERE idf = ?
    `;
    const values = [miscfee, remarks, idf]; // No total_fee in values now

    db.query(query, values, (error, result) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query failed." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No record found or already updated." });
      }

      return res.status(200).json({ message: "Misc fee and remarks updated successfully." });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});


module.exports = router;
