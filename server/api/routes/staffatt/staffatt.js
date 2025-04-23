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
// Function to initiate staff attendance
// Initiate staff attendance
router.post("/initiate-attendance", checkAuth, async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const queryBasicInfo = "SELECT cnic FROM staff_tbl";  // Fetch staff CNICs

  db.query(queryBasicInfo, (error, staffInfoResults) => {
    if (error) return res.status(500).json({ error: "Database query failed" });

    let insertedRecords = 0;
    let pendingQueries = staffInfoResults.length;

    staffInfoResults.forEach((info) => {
      const checkExistingQuery = `SELECT * FROM staff_attendance WHERE cnic_att = ? AND curr_date = ?`;
      db.query(checkExistingQuery, [info.cnic, currentDate], (err, existingRecord) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        
        if (existingRecord.length === 0) {
          const insertSQL = "INSERT INTO staff_attendance (cnic_att, curr_date) VALUES (?, ?)";
          db.query(insertSQL, [info.cnic, currentDate], (insertErr) => {
            if (insertErr) console.error("Insert staff attendance record error:", insertErr);
            else insertedRecords++;
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

// Get staff attendance records for the current date
router.get("/", checkAuth, async (req, res) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const queryAttendance = `
    SELECT staff_attendance.*, staff_tbl.*
    FROM staff_attendance
    JOIN staff_tbl ON staff_attendance.cnic_att = staff_tbl.cnic
    WHERE staff_attendance.curr_date = ? AND staff_attendance.attendance IS Null`;

  db.query(queryAttendance, [currentDate], (error, attendanceRecords) => {
    if (error) return res.status(500).json({ error: "Database query failed" });
    res.status(200).json({ attendanceRecords: attendanceRecords || [] });
  });
});

// Update attendance
router.patch("/update/:att_id", checkAuth, async (req, res) => {
  const att_id = req.params.att_id;
  const attendance = req.body.attendance;

  const updateSQL = "UPDATE staff_attendance SET attendance = ?, time_date = NOW() WHERE att_id = ?";
  db.query(updateSQL, [attendance, att_id], (error, results) => {
    if (error) return res.status(500).json({ error: "Database query failed" });
    res.status(200).json({ success: true });
  });
});



// Get years
router.get("/years", checkAuth, (req, res) => {
  const query = "SELECT DISTINCT YEAR(curr_date) AS year FROM staff_attendance";
  db.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch years" });
    res.status(200).json(results);
  });
});

// Get months
router.get("/months", checkAuth, (req, res) => {
  const query = "SELECT DISTINCT MONTH(curr_date) AS month FROM staff_attendance";
  db.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Failed to fetch months" });
    res.status(200).json(results);
  });
});

router.get("/att", checkAuth, (req, res) => {
  const { selectedYear, selectedMonth } = req.query;

  const queryAttendance = `
    SELECT staff_attendance.*, staff_tbl.name
    FROM staff_attendance
    JOIN staff_tbl ON staff_attendance.cnic_att = staff_tbl.cnic
    WHERE YEAR(curr_date) = ? AND MONTH(curr_date) = ?`;

  db.query(queryAttendance, [selectedYear, selectedMonth], (error, attendanceRecords) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Ensure attendance is an array in the response
    const formattedRecords = attendanceRecords.map(record => {
      return {
        att_adm_no: record.cnic_att, // Ensure this matches your 'adm_no'
        name: record.name,
        attendance: record.attendance ? JSON.parse(record.attendance) : new Array(new Date(selectedYear, selectedMonth, 0).getDate()).fill('Absent')
      };
    });

    res.status(200).json({ attendanceRecords: formattedRecords });
  });
});



module.exports = router;
