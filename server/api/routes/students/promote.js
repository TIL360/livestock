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
  //console.log('Connected to MySQL database');
});


// Update student standards
router.patch('/update', checkAuth, async (req, res) => {
  const updates = req.body; // Array of { adm_no, standard }

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: 'No updates provided' });
  }

  const updatePromises = updates.map(({ adm_no, standard }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE basicinfo SET standard = ?, updated_at = NOW() WHERE adm_no = ?';
      db.query(sql, [standard, adm_no], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return reject(new Error('Student not found'));
        }
        resolve();
      });
    });
  });

  try {
    await Promise.all(updatePromises);
    res.status(200).json({ message: 'Standards updated successfully' });
  } catch (error) {
    console.error('Error updating students:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update student status to inactive
router.patch('/inactive', checkAuth, async (req, res) => {
  const updates = req.body; // Array of { adm_no }
  const inactive = "Inactive";

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: 'No updates provided' });
  }

  const updatePromises = updates.map(({ adm_no }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE basicinfo SET status = ?, updated_at = NOW() WHERE adm_no = ?';
      db.query(sql, [inactive, adm_no], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return reject(new Error('Student not found'));
        }
        resolve();
      });
    });
  });

  try {
    await Promise.all(updatePromises);
    res.status(200).json({ message: 'Students status updated to inactive successfully' });
  } catch (error) {
    console.error('Error updating students:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
