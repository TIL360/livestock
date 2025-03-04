const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');

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
    console.log('Connected to MySQL database');
});

router.post("/result", checkAuth, (req, res) => { 
  const { year, month } = req.body; // Destructure only year and month from body

  // First, retrieve all existing records for the specified year and month from result_tbl
  const existingResultsQuery = "SELECT result_adm_no FROM result_tbl WHERE year = ? AND month = ?";
  
  db.query(existingResultsQuery, [year, month], (existingError, existingResults) => {
      if (existingError) { 
          console.error("Error fetching existing results:", existingError); 
          return res.status(500).json({ error: "Failed to fetch existing results", details: existingError }); 
      }

      // Create a set of existing admission numbers for quick lookup
      const existingAdmNos = new Set(existingResults.map(row => row.result_adm_no));

      // Now retrieve all active records from basicinfo
      const basicInfoQuery = "SELECT * FROM basicinfo WHERE status = 'Active'";
      
      db.query(basicInfoQuery, (error, basicInfoResults) => { 
          if (error) { 
              console.error("Error fetching basic info:", error); 
              return res.status(500).json({ error: "Failed to fetch basic info", details: error }); 
          }
          
          if (basicInfoResults.length === 0) {
              return res.status(404).json({ error: "No active basic info found" });
          }

          const created_at = new Date(); // Current date and time for created_at
          const insertPromises = []; // Array to hold insert promises

          basicInfoResults.forEach((basicInfo) => {
              const result_adm_no = basicInfo.adm_no;

              // Check if the admission number already exists in the result_tbl for the year and month
              if (!existingAdmNos.has(result_adm_no)) {
                  // Prepare the insert operation
                  const query = "INSERT INTO result_tbl (year, month, result_adm_no, result_standard, created_at) VALUES (?, ?, ?, ?, ?)";
                  const insertPromise = new Promise((resolve, reject) => {
                      db.query(query, [year, month, result_adm_no, basicInfo.standard, created_at], (insertError) => {
                          if (insertError) {
                              console.error("Error inserting result:", insertError);
                              reject({ error: "Database insertion failed", details: insertError });
                          } else {
                              resolve();
                          }
                      });
                  });
                  insertPromises.push(insertPromise);
              }
          });

          // Wait for all insertions to finish
          Promise.all(insertPromises)
              .then(() => {
                  return res.status(200).json({ success: true, message: "New results inserted successfully" });
              })
              .catch(err => {
                  return res.status(500).json(err);
              });
      });
  });
});


// Endpoint to get distinct years, months, and standards
router.get("/selectboxes", checkAuth, (req, res) => {
// Ensure the following queries return the correct structure
const queryYear = "SELECT DISTINCT year FROM result_tbl";
const queryMonth = "SELECT DISTINCT month FROM result_tbl WHERE month IS NOT NULL";
const queryStandard = "SELECT DISTINCT result_standard FROM result_tbl";


  db.query(queryYear, (err, years) => {
      if (err) return res.status(500).json({ error: "Error fetching years", details: err });

      db.query(queryMonth, (err, months) => {
          if (err) return res.status(500).json({ error: "Error fetching months", details: err });

          db.query(queryStandard, (err, standards) => {
              if (err) return res.status(500).json({ error: "Error fetching standards", details: err });

              res.status(200).json({ years, months, standards });
          });
      });
  });
});

// Endpoint to get distinct subjects
router.get("/subjects", checkAuth, (req, res) => {
  const querySubject = "SELECT DISTINCT subject FROM q_bank";
  db.query(querySubject, (err, subjects) => {
    if (err) return res.status(500).json({ error: "Error fetching subjects", details: err });
    res.status(200).json(subjects);
  });
});


router.patch("/marks", checkAuth, (req, res) => {
  const { standard, examYear, examName, TMS1, TMS2, TMS3, TMS4, TMS5, TMS6, TMS7, TMS8 } = req.body;

  // Create a query to update the record based on the criteria
  const updateQuery = `
    UPDATE result_tbl 
    SET TMS1 = ?, TMS2 = ?, TMS3 = ?, TMS4 = ?, TMS5 = ?, TMS6 = ?, TMS7 = ?, TMS8 = ?
    WHERE year = ? AND month = ? AND result_standard = ?
  `;

  db.query(updateQuery, [TMS1, TMS2, TMS3, TMS4, TMS5, TMS6, TMS7, TMS8, examYear, examName, standard], (updateError, results) => {
    if (updateError) {
      console.error("Error updating result:", updateError);
      return res.status(500).json({ error: "Database update failed", details: updateError });
    }

    // Check if any rows were affected to determine if the update was successful
    if (results.affectedRows === 0) {
      // If no rows were affected, it means there was no record to update
      return res.status(404).json({ error: "No record found to update" });
    }

    // Send success response after the update
    return res.status(200).json({ success: true, message: "Results updated successfully" });
  });
});


router.get("/exam", checkAuth, (req, res) => {
  db.query(
    `SELECT DISTINCT month 
     FROM result_tbl`, // Fetch unique months
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error fetching results", details: err });
      res.status(200).json(results);
    }
  );
});

router.get("/year", checkAuth, (req, res) => {
  db.query(
    `SELECT DISTINCT year 
     FROM result_tbl`, // Fetch unique years
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error fetching results", details: err });
      res.status(200).json(results);
    }
  );
});

  module.exports = router;