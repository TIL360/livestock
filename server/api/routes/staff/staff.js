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
    console.error("Database connection failed:", err);
    return;
  }
});

// GET request for fetching all staff details
router.get('/', checkAuth, (req, res) => {
  db.query('SELECT * FROM staff_tbl', (err, results) => {
    if (err) {
      console.error('Error fetching staff data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results); // Send back the list of staff
  });
});
 
// Route to add a staff member

// POST request to add a new staff record
router.post('/staff-add', checkAuth, upload.single('image'), (req, res) => {
  const { name, father_name, cnic, salary, allowance, mobile, doj, appointment, standard, status, email, address } = req.body;
  
  // Check if an image was uploaded
  const imagePath = req.file ? req.file.path : null; // Set to null if no file
  const created_at = new Date();
  // SQL to insert new staff record
  const sql = 'INSERT INTO staff_tbl (name, father_name, cnic, salary, allowance, mobile, image, doj, appointment, standard, status, email, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [name, father_name, cnic, salary, allowance, mobile, imagePath, doj, appointment, standard, status, email, address, created_at], (err, result) => {
    if (err) {
        console.error('Error adding staff:', err);
        if (err.code === 'ER_DUP_ENTRY') { // This checks for duplicate entry error
            return res.status(400).json({ error: 'Duplicate entry for CNIC. This CNIC is already in use.' });
        }
        return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, name, father_name });
});

});


// Get staff details for editing
router.get('/:staffid', checkAuth, (req, res) => {
  const staffid = req.params.staffid;
  db.query('SELECT * FROM staff_tbl WHERE staffid = ?', [staffid], (err, results) => {
      if (err) {
          console.error('Error fetching staff data:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Staff not found' });
      }
      res.json(results[0]);
  });
});

// Update staff record
// Update staff record
router.patch('/:staffid', checkAuth, upload.single('image'), (req, res) => {
  const staffid = req.params.staffid;
  const { name, father_name, cnic, salary, allowance, mobile, doj, appointment, standard, status, email, address } = req.body;
  const updated_at = new Date();
  // SQL to check the current staff data
  db.query('SELECT image FROM staff_tbl WHERE staffid = ?', [staffid], (err, results) => {
    if (err) {
      console.error('Error fetching staff data:', err);
      return res.status(500).json({ message: 'Database error' });
    } 

    if (results.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const existingImagePath = results[0].image;

    // SQL to update all relevant fields
    let sql = 'UPDATE staff_tbl SET name = ?, father_name = ?, cnic = ?, salary = ?, allowance = ?, mobile = ?, doj = ?, appointment = ?, standard = ?, status = ?, email = ?, address = ?, updated_at = ?';
    const params = [name, father_name, cnic, salary, allowance, mobile, doj, appointment, standard, status, email, address, updated_at];

    // Include existing image path if no new image
    if (req.file) {
      const imagePath = req.file.path;
      sql += ', image = ? WHERE staffid = ?';
      params.push(imagePath, staffid);
    } else {
      sql += ', image = ? WHERE staffid = ?';
      params.push(existingImagePath, staffid); // maintain the existing image if no new file uploaded
    }
    
    // Perform the update
    db.query(sql, params, (err) => {
      if (err) {
        console.error('Error updating staff:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'Staff updated successfully.' });
    });
  });
});


// DELETE request to remove a staff record
router.delete('/:staffid', checkAuth, (req, res) => {
  const staffid = req.params.staffid;
  
  // SQL to delete staff record
  const sql = 'DELETE FROM staff_tbl WHERE staffid = ?';
  
  db.query(sql, [staffid], (err, results) => {
      if (err) {
          console.error('Error deleting staff:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Staff not found' });
      }
      
      res.json({ message: 'Staff deleted successfully.' });
  });
});

  module.exports = router;