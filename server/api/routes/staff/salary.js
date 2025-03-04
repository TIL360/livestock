const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
destination: function(req, file, cb){
  cb(null, './uploads/staff');
},
filename: function(req, file, cb){
cb(null, file.originalname);
}
}); 

const fileFilter = (req, file, cb) => {
  
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){

    cb(null, true);
  }else{

    cb(null, false);
  }
}


const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: fileFilter

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
    console.error('Database connection failed:', err);
    return;
  }
  //console.log('Connected to MySQL database');
});


// Function to insert salary records
router.post("/insert-salary", checkAuth, async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript

    // Calculate the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const queryStaffInfo = "SELECT staffid, salary, allowance FROM staff_tbl";

    db.query(queryStaffInfo, (error, staffbasicInfoResults) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }
        
        let insertedRecords = 0;
        const totalQueries = staffbasicInfoResults.length;
        let pendingQueries = totalQueries;

        if (totalQueries === 0) {
            return res.status(200).json({ success: true, insertedRecords });
        }

        staffbasicInfoResults.forEach((info) => {
            const checkExistingQuery = `
                SELECT * FROM salary_tbl WHERE staff_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ?
            `;

            db.query(
                checkExistingQuery,
                [info.staffid, currentYear, currentMonth],
                (err, existingRecord) => {
                    if (err) {
                        console.error("Check existing record error:", err);
                        if (--pendingQueries === 0) {
                            res.status(200).json({ success: true, insertedRecords });
                        }
                        return;
                    }

                    if (existingRecord.length === 0) {
                        // Insert new record with days_month field
                        const insertSQL = `
                            INSERT INTO salary_tbl (staff_id, salary, allowance, created_at, days_month) VALUES (?, ?, ?, ?, ?)
                        `;
                        db.query(
                            insertSQL,
                            [info.staffid, info.salary, info.allowance, new Date(), daysInMonth], // Pass daysInMonth here
                            (insertErr) => {
                                if (insertErr) {
                                    console.error("Insert salary record error:", insertErr);
                                } else {
                                    insertedRecords++;
                                }
                                if (--pendingQueries === 0) {
                                    res.status(200).json({ success: true, insertedRecords });
                                }
                            }
                        );
                    } else {
                        // If record exists, just reduce the pending queries counter
                        if (--pendingQueries === 0) {
                            res.status(200).json({ success: true, insertedRecords });
                        }
                    }
                }
            );
        });
    });
});


  
// Endpoint to get salary data along with staff information
router.get("/", checkAuth, async (req, res) => {
  const query = `
      SELECT staff_tbl.*, salary_tbl.*
      FROM staff_tbl
      JOIN salary_tbl ON staff_tbl.staffid = salary_tbl.staff_id
  `;

  db.query(query, (error, results) => {
      if (error) {
          console.error("Database query error:", error); 
          return res.status(500).json({ error: "Database query failed" }); 
      }
      res.status(200).json({ success: true, data: results }); 
  });
});

// Update leaves based on salaryid
router.patch('/update-leaves/:salaryid', checkAuth, (req, res) => {
    const salaryid = req.params.salaryid;
    const { leave_availed, security } = req.body; // Add security field
    const sql = 'UPDATE salary_tbl SET leave_availed = ?, security = ? WHERE salaryid = ?';
    db.query(sql, [leave_availed, security, salaryid], (err, results) => {
      if (err) {
        console.error('Error updating leaves:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Salary record not found' });
      }
      res.json({ message: 'Leaves and security updated successfully.' });
    });
  });
  


// Endpoint to get salary data by salaryid
router.get("/:salaryid", checkAuth, async (req, res) => {
    const salaryid = req.params.salaryid;
    const query = `SELECT leave_availed, security FROM salary_tbl WHERE salaryid = ?`;
    db.query(query, [salaryid], (error, results) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query failed" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Salary record not found" });
      }
      res.status(200).json({ leave_availed: results[0].leave_availed, security: results[0].security });
    });
  });
  module.exports = router;