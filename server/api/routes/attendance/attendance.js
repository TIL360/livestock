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
// Function to insert fee records
router.post("/initiate-attendance", checkAuth, async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const queryBasicInfo = "SELECT adm_no, standard FROM basicinfo";
  db.query(queryBasicInfo, (error, basicInfoResults) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    let insertedRecords = 0;
    let pendingQueries = basicInfoResults.length;
    basicInfoResults.forEach((info) => {
      const checkExistingQuery = `SELECT * FROM attendance WHERE att_adm_no = ? AND curr_date = ?`;
      db.query(checkExistingQuery, [info.adm_no, currentDate], (err, existingRecord) => {
        if (err) {
          console.error("Check existing record error:", err);
          return res.status(500).json({ error: "Database query failed" });
        }
        if (existingRecord.length === 0) {
          // Insert new record
          const insertSQL = "INSERT INTO attendance (att_adm_no, attstandard, curr_date) VALUES (?, ?, ?)";
          db.query(insertSQL, [info.adm_no, info.standard, currentDate], (insertErr) => {
            if (insertErr) {
              console.error("Insert fee record error:", insertErr);
            } else {
              insertedRecords++;
            }
            if (--pendingQueries === 0) {
              res.status(200).json({ success: true, insertedRecords });
            }
          });
        } else {
          if (--pendingQueries === 0) {
            res.status(200).json({ success: true, insertedRecords });
          }
        }
      });
    });
  });
});

// Function to get attendance records for current date
router.get("/", checkAuth, async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  
  const queryAttendance = `
  SELECT attendance.*, basicinfo.*
  FROM attendance
  JOIN basicinfo ON attendance.att_adm_no = basicinfo.adm_no
  WHERE attendance.curr_date = ? AND (attendance.attendance IS NULL OR attendance.attendance = '')
`;
  




  db.query(queryAttendance, [currentDate], (error, attendanceRecords) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ attendanceRecords });
  });
});

//mark attendance
router.patch("/update/:att_id", checkAuth, async (req, res) => {
  const att_id = req.params.att_id;
  const attendance = req.body.attendance;
  const updateSQL = "UPDATE attendance SET attendance = ? WHERE att_id = ?";
  db.query(updateSQL, [attendance, att_id], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ success: true });
  });
});

// Example route to fetch standards
router.get("/standards", checkAuth, (req, res) => {
  const query = "SELECT DISTINCT attstandard FROM attendance";
  db.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch standards" });
    res.status(200).json(results);
  });
});

// Example route to fetch years
router.get("/years", checkAuth, (req, res) => {
  // Assuming your attendance table has a column named 'curr_date'
  const query = "SELECT DISTINCT YEAR(curr_date) AS year FROM attendance";
  db.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch years" });
    res.status(200).json(results);
  });
});

// Example route to fetch months
router.get("/months", checkAuth, (req, res) => {
  const query = "SELECT DISTINCT MONTH(curr_date) AS month FROM attendance";
  db.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch months" });
    res.status(200).json(results);
  });
});



router.get("/attendance", checkAuth, (req, res) => {
  const { attstandard, attyear, attmonth } = req.query;
  
  const queryAttendance = `
    SELECT * FROM attendance
    WHERE attstandard = ? AND YEAR(curr_date) = ? AND MONTH(curr_date) = ?
  `;

  db.query(queryAttendance, [attstandard, attyear, attmonth], (error, attendanceRecords) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ attendanceRecords });
  });
});

module.exports = router;
