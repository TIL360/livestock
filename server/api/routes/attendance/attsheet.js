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
  const { attstandard, attyear, attmonth } = req.query;

  // Adjust the query to match your db table and columns
  const queryAttendance = `
SELECT attendance.*, basicinfo.name
FROM attendance
JOIN basicinfo ON attendance.att_adm_no = basicinfo.adm_no
WHERE attstandard = ? AND YEAR = ? AND MONTH = ?`;

db.query(queryAttendance, [attstandard, attyear, attmonth], (error, attendanceRecords) => {
    if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query failed" });
    }
    console.log("Fetched Attendance Records:", attendanceRecords); // Log the results

    // Process and send data
    const daysInMonth = new Date(attyear, attyear === '2' ? 3 : attyear * 1, 0).getDate();
    const summary = {};
    attendanceRecords.forEach(record => {
        const admNo = record.att_adm_no;
        const date = new Date(record.curr_date);
        if (!summary[admNo]) {
            summary[admNo] = {
                att_adm_no: admNo,
                name: record.name, // Add the name property to the summary
                attendance: new Array(daysInMonth).fill(''),
            };
        }
        const day = date.getDate() - 1;
        summary[admNo].attendance[day] = record.attendance;
    });

    const summaryArray = Object.values(summary);
    res.status(200).json({ attendanceRecords: summaryArray });
});

});



module.exports = router;
