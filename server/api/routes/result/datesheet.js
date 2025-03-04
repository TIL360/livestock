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
    console.log('Connected to MySQL database');
});




// Existing imports and setup...

router.post('/add', checkAuth, (req, res) => {
  const { subject, date, year, exam, standard } = req.body;

  // Check for existing entry
  db.query(
      'SELECT * FROM date_sheet WHERE subject = ? AND date = ? AND year = ? AND exam = ? AND standard = ?',
      [subject, date, year, exam, standard],
      (err, results) => {
          if (err) {
              console.error('Error checking for existing entry:', err);
              return res.status(500).json({ error: 'Error checking for existing entry', details: err });
          }
          if (results.length > 0) {
              return res.status(400).json({ error: 'This subject and date combination already exists for the selected year, exam, and standard.' });
          }

          // If no existing entry, insert the new one
          db.query(
              'INSERT INTO date_sheet (subject, date, year, exam, standard) VALUES (?, ?, ?, ?, ?)',
              [subject, date, year, exam, standard],
              (err, results) => {
                  if (err) {
                      console.error('Error inserting data:', err);
                      return res.status(500).json({ error: 'Error inserting data', details: err });
                  }
                  res.status(201).json({ message: 'Date Sheet created successfully!', id: results.insertId });
              }
          );
      }
  );
});

  
  // Fetch available years (implement according to your DB structure)
  router.get('/examination', checkAuth, (req, res) => {
    // Assuming you have a years table or some other logic
    db.query('SELECT DISTINCT exam FROM date_sheet', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching years', details: err });
      res.status(200).json(results);
    });
});

  // Fetch available years (implement according to your DB structure)
router.get('/years', checkAuth, (req, res) => {
    // Assuming you have a years table or some other logic
    db.query('SELECT DISTINCT year FROM result_tbl', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching years', details: err });
      res.status(200).json(results);
    });
});

  // Fetch available years (implement according to your DB structure)
  router.get('/exams', checkAuth, (req, res) => {
    // Assuming you have a years table or some other logic
    db.query('SELECT DISTINCT month FROM result_tbl', (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching years', details: err });
      res.status(200).json(results);
    });
});

// Fetch available years (implement according to your DB structure)
router.get('/standards', checkAuth, (req, res) => {
  // Assuming you have a years table or some other logic
  db.query('SELECT DISTINCT standard FROM classes', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching years', details: err });
    res.status(200).json(results);
  });
});

// Fetch date sheet for a specific year and exam
router.get('/report', checkAuth, (req, res) => {
  const { year, exam } = req.query; // Changed from `month` to `exam`
 
  console.log(`Querying for year: ${year}, exam: ${exam}`); // Debugging log

  db.query(
    'SELECT * FROM date_sheet WHERE year = ? AND exam = ?',
    [year, exam], // Ensure you're passing the correct second variable
    (err, results) => {
        if (err) {
             return res.status(500).json({ error: 'Error fetching date sheet', details: err });
        }
        res.status(200).json({ records: results });
    }
  );
});


// Fetch date sheet for a specific year and exam
router.get('/papersadded', checkAuth, (req, res) => {
  const { year, exam, standard } = req.query; // Add `standard` to the destructured parameters

  // Adjust the SQL query to filter by `year`, `exam`, and `standard`
  db.query(
    'SELECT * FROM date_sheet WHERE year = ? AND exam = ? AND standard = ?', // Update SQL query
    [year, exam, standard],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching date sheet', details: err });
      }
      res.status(200).json({ records: results });
    }
  );
});



// Update date sheet entry
router.patch('/edit/:id', checkAuth, (req, res) => {
  const { id } = req.params;
  const { subject, date, year, exam, standard } = req.body;

  db.query(
      'UPDATE date_sheet SET subject = ?, date = ?, year = ?, exam = ?, standard = ? WHERE id = ?',
      [subject, date, year, exam, standard, id],
      (err, results) => {
          if (err) {
              console.error('Error updating data:', err);
              return res.status(500).json({ error: 'Error updating data', details: err });
          }
          res.status(200).json({ message: 'Date Sheet updated successfully!' });
      }
  );
});

// Update date sheet entry
router.delete('/:id', checkAuth, (req, res) => {
  const { id } = req.params;
  
  db.query(
      'DELETE FROM date_sheet WHERE id = ?',
      [ id],
      (err, results) => {
          if (err) {
              console.error('Error updating data:', err);
              return res.status(500).json({ error: 'Error updating data', details: err });
          }
          res.status(200).json({ message: 'Date Sheet updated successfully!' });
      }
  );
});

// Fetch a specific date sheet entry by ID
router.get('/datesheet/:id', checkAuth, (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM date_sheet WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching date sheet entry', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Date sheet entry not found' });
    }
    res.status(200).json(results[0]); // Return the first record
  });
});


  module.exports = router;