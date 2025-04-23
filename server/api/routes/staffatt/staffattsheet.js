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

router.get("/", checkAuth, (req, res) => {
  const { attyear, attmonth } = req.query;

  const queryAttendance = `
    SELECT staff_attendance.*, staff_tbl.name
    FROM staff_attendance
    JOIN staff_tbl ON staff_attendance.cnic_att = staff_tbl.cnic
    WHERE YEAR(curr_date) = ? AND MONTH(curr_date) = ?`;

  db.query(queryAttendance, [attyear, attmonth], (error, attendanceRecords) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    const daysInMonth = new Date(attyear, attmonth, 0).getDate();
    const summary = {};
    
    attendanceRecords.forEach(record => {
      const cnic = record.cnic_att;
      const date = new Date(record.curr_date);
      if (!summary[cnic]) {
        summary[cnic] = {
          att_adm_no: record.cnic_att, // Assuming cnic is the admission number
          name: record.name,
          attendance: new Array(daysInMonth).fill('Absent'), // Default to 'Absent'
        };
      }
      const day = date.getDate() - 1;
      summary[cnic].attendance[day] = record.attendance || 'Absent'; // Use attendance value if available
    });

    const summaryArray = Object.values(summary);
    res.status(200).json({ attendanceRecords: summaryArray });
  });
});


module.exports = router;
