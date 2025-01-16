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
    console.log('Connected to MySQL database');
});

router.get("/", checkAuth, (req, res) => {
    const { year, month, standard } = req.query; // Fetch the standard from the query parameters
    db.query(
      `SELECT * 
       FROM result_tbl 
       INNER JOIN basicinfo 
       ON result_tbl.result_adm_no = basicinfo.adm_no 
       WHERE result_tbl.year = ? AND result_tbl.month = ? AND result_tbl.	result_standard = ?`, // Add the standard to the WHERE clause
      [year, month, standard], // Include standard in the parameters
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error fetching results", details: err });
        res.status(200).json(results);
      }
    );
  });
  

  router.get('/results/:resultid', checkAuth, (req, res) => {
    const { resultid } = req.params; 
    db.query(
        `SELECT OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 FROM result_tbl WHERE resultid = ?`, 
        [resultid], 
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error fetching results", details: err });
            res.status(200).json(results[0]); // Return the first result
        }
    );
  });
  
  
// Update obtained marks
router.patch('/results/:resultid', checkAuth, (req, res) => {
  const { resultid } = req.params; 
  const { OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 } = req.body;

  db.query(
      `UPDATE result_tbl SET OM1 = ?, OM2 = ?, OM3 = ?, OM4 = ?, OM5 = ?, OM6 = ?, OM7 = ?, OM8 = ? WHERE resultid = ?`, 
      [OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8, resultid],
      (err, results) => {
          if (err) return res.status(500).json({ error: "Error updating marks", details: err });
          res.status(200).json({ message: "Marks updated successfully!" });
      }
  );
});




// Pend result
router.post('/pend-result', checkAuth, (req, res) => {
  const { year, month } = req.body; 


  db.query(
    `UPDATE result_tbl SET publication = 'Pend' WHERE year = ? AND month = ?`, 
    [year, month],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error pending result", details: err });
      res.status(200).json({ message: "Result marked as pending!" });
    }
  );
});



// pUBLISH result
// Publish result
router.patch('/publish-result', checkAuth, async (req, res) => {
  const { year, month, standard } = req.body;
  console.log("Received parameters:", { year, month, standard }); // Corrected variable name to standard
  try {
      await new Promise((resolve, reject) => {
          db.query(
              `UPDATE result_tbl SET publication = 'Publish' WHERE year = ? AND month = ? AND result_standard = ?`,
              [year, month, standard],
              (err) => {
                  if (err) return reject(err);
                  resolve();
              }
          );
      });

      const results = await new Promise((resolve, reject) => {
          db.query(
              `SELECT result_adm_no, OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 FROM result_tbl WHERE year = ? AND month = ? AND result_standard = ?`,
              [year, month, standard],
              (err, results) => {
                  if (err) return reject(err);
                  resolve(results);
              }
          );
      });

      const positionMapping = results.reduce((acc, student) => {
          const totalMarks = Object.values(student).slice(1).reduce((sum, marks) => sum + marks, 0);
          acc[student.result_adm_no] = totalMarks;
          return acc;
      }, {});

      const sortedStudents = Object.entries(positionMapping).sort(([, a], [, b]) => b - a);

      await Promise.all(sortedStudents.map(([admNo], index) =>
          new Promise((resolve, reject) => {
              db.query(
                  `UPDATE result_tbl SET position = ? WHERE result_adm_no = ? AND year = ? AND month = ? AND result_standard = ?`,
                  [index + 1, admNo, year, month, standard],
                  (err) => {
                      if (err) return reject(err);
                      resolve();
                  }
              );
          })
      ));

      res.status(200).json({ message: "Results published and positions updated successfully!" });
  } catch (err) {
      console.error("Error in publish-result:", err);
      res.status(500).json({ error: "Error occurred while publishing result", details: err });
  }
});



  module.exports = router;