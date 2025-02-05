const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');

require('dotenv').config();





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


// New endpoint for fetching all records
router.get("/", checkAuth, (req, res) => {
    const query = 'SELECT * FROM applications';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });
  
router.post('/', (req, res) => {
  const {
    name,
    father,
    cnic,
    dob,
    email,
    gender,
    studentmobile,
    fathermobile,
    matricmarks,
    fsc,
    domicile,
    progame,
    address,
  } = req.body;

  const sql = 'INSERT INTO applications SET ?';
  const data = {
    name,
    father,
    cnic,
    dob,
    email,
    gender,
    studentmobile,
    fathermobile,
    matricmarks,
    fsc,
    domicile,
    progame,
    address,
  };

  db.query(sql, data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Application submitted successfully!' });
    }
  });
});


// Add this to your existing router file
router.delete('/:id', checkAuth, (req, res) => {
  const id = req.params.id; // Get the ID from the URL

  const sql = 'DELETE FROM applications WHERE applyid = ?'; // Assuming 'id' is the primary key in your applications table

  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Error deleting data:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Application not found' });
      }
      res.json({ message: 'Application deleted successfully!' });
  });
});


module.exports = router;
