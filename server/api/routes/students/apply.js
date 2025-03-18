const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');

require('dotenv').config();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads/applications'); // Make sure this directory exists
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  } else {
    cb(null, false);
  }
}



const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
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
   
  router.post('/', upload.single('image'), (req, res) => {
    const { name, father, cnic, dob, email, gender, studentmobile, fathermobile, qual, domicile, progame, address, experience, name_urdu, fname_urdu, father_cnic, mother_cnic, father_profession, religion, caste, previous_school, dob_urdu, type } = req.body;

    const imagePath = req.file ? req.file.path : null;
    console.log(req.body); // Log the incoming request body
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
      qual, // Ensure this is spelled correctly
      domicile,
      progame,
      address,
      exp: experience,
      image: imagePath,
      type,
      name_urdu,
      fname_urdu,
      father_cnic,
      mother_cnic,
      father_profession,
      religion,
      caste,
      previous_school,
      dob_urdu
    };
    
  
    db.query(sql, data, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Application submitted successfully!', applicationId: result.insertId });
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


// Add this to your existing router file

router.post('/basicinfo', checkAuth, (req, res) => {
  console.log(req.body); // Log the incoming request body
  const {
    adm_no,
    name,
    father,
    dob,
    email,
    gender,
    studentmobile,
    address,
    image, 
    father_cnic,
    mother_cnic,
    father_profession,
    religion,
    caste,
    previous_school,
    dob_urdu,
    progame,
    // Ensure mother_cnic, father_cnic, and address are included
 
} = req.body;


  // Assigning standard and adm_standard to the value of progame
  const standard = progame; 
  const status = 'Active';
  const sql = 'INSERT INTO basicinfo (adm_no, name, father, dob, email, gender, mobile, address, image, father_cnic, mother_cnic, father_profession, religion, caste, previous_school, dob_urdu, adm_standard, standard, status, name_urdu, fname_urdu) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  
  const values = [
      adm_no, name, father, dob, email, gender, studentmobile, address, image, father_cnic, mother_cnic, father_profession, religion, caste, previous_school, dob_urdu, standard, standard, status, req.body.name_urdu, req.body.fname_urdu 
  ];

  console.log('Values to be inserted:', values); // Debugging
  
  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error inserting into basicinfo:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Application accepted and data saved to basicinfo!' });
  });
});

router.post('/staff', checkAuth, (req, res) => {
  console.log(req.body); // Log the incoming request body
  const {
      name,
      father,
      cnic,
      email,
      studentmobile,
      address,
      image,
      appointment,
      salary,
      allowance,
      doj // Date of Joining
  } = req.body;

  const status = 'Active'; // Set default status
  const sql = 'INSERT INTO staff_tbl (name, father_name, cnic, email, mobile, address, image, appointment, salary, allowance, doj, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

  const values = [
                                       name, father, cnic, email, studentmobile, address, image, appointment, salary, allowance, doj, status
  ];

  console.log('Values to be inserted into staff_tbl:', values); // Debugging
  
  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error inserting into staff_tbl:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Job application accepted and data saved to staff_tbl!' });
  });
});


module.exports = router;
