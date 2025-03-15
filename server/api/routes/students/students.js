const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');

require('dotenv').config();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
destination: function(req, file, cb){
  cb(null, './uploads');
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


 

// New endpoint for profile or verification
router.get("/", checkAuth, (req, res) => {
  const query = 'SELECT * FROM basicinfo WHERE status = "Active"';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
});




    //   res.status(200).json({
//     message: 'Handling GET requests to /students'
//   });
});

// New endpoint for profile or verification
router.get("/inactive", checkAuth, (req, res) => {
  const query = 'SELECT * FROM basicinfo WHERE status = "Inactive"';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
});




    //   res.status(200).json({
//     message: 'Handling GET requests to /students'
//   });
});
 
router.post('/', checkAuth, upload.single('image'), (req, res) => {
  
  try {
    const {
      adm_no, // Make sure this value is not null
      roll_no,
      name,
      father,
      nameurdu,
      fatherurdu,
      monthly_fee,
      status,
      adm_date,
      adm_standard,
      current_standard,
      mobile,
      email,
      section,
      dob,
      address,
      gender,
      father_cnic,
      mother_cnic,
      father_profession,
      religion,
      caste,
      previous_school,
      dob_urdu
    } = req.body;

    if (!adm_no) { // Check if adm_no is null or empty
      console.log('adm_no is empty or null');
      return res.status(400).json({ error: 'Admission number is required' });
    }

    const imagePath = req.file ? req.file.path : null;
    const created_at = new Date();

    const sql = `
      INSERT INTO basicinfo (
        adm_no,
        roll_no,
        name,
        father,
        monthly_fee,
        status,
        image,
        created_at,
        updated_at,
        standard,
        section,
        adm_date,
        adm_standard,
        mobile,
        email,
        dob,
        address,
        gender,
        father_cnic,
        mother_cnic,
        father_profession,
        religion,
        caste,
        previous_school,
        name_urdu,
        fname_urdu,
        dob_urdu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      adm_no,
      roll_no,
      name,
      father,
      monthly_fee,
      status,
      imagePath,
      created_at,
      null, // updated_at
      current_standard,
      section,
      adm_date,
      adm_standard,
      mobile,
      email,
      dob,
      address,
      gender,
      father_cnic,
      mother_cnic,
      father_profession,
      religion,
      caste,
      previous_school,
      nameurdu,
      fatherurdu,
      dob_urdu
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting student: ', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.status(201).json({ id: result.insertId, adm_no, name });
    });
  } catch (error) {
    console.error('Error inserting student: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Handling GET by admno

router.get('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM basicinfo WHERE id = ?';
  db.query(query, [id], (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Student not found' });
      }
      res.json(results[0]);
  });
});

  
// Get student by ID
router.get('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM basicinfo WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(results[0]);
  });
});

// Update student
router.patch('/:id', checkAuth, upload.single('image'), (req, res) => {
  const id = req.params.id;
  
  // Ensure all fields are set up correctly
  const {
    adm_no,
    roll_no,
    name,
    father,
    name_urdu,
    fname_urdu,
    monthly_fee,
    status,
    adm_date,
    adm_standard,
    standard,
    mobile,
    email,
    address,
    gender,
    father_cnic,
    mother_cnic,
    father_profession,
    religion,
    caste,
    previous_school,
    dob_urdu,
    dob,
  } = req.body;

  // Validate required fields
  if (!adm_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  // Add more validation as needed...

  let sql = `UPDATE basicinfo SET 
    adm_no = ?, 
    roll_no = ?, 
    name = ?, 
    father = ?, 
    name_urdu = ?, 
    fname_urdu = ?, 
    monthly_fee = ?, 
    status = ?, 
    adm_date = ?, 
    adm_standard = ?, 
    standard = ?, 
    mobile = ?, 
    email = ?, 
    address = ?, 
    gender = ?, 
    father_cnic = ?, 
    mother_cnic = ?, 
    father_profession = ?, 
    religion = ?, 
    caste = ?, 
    previous_school = ?, 
    dob_urdu = ?,  
    dob = ?, 
    updated_at = NOW()`;

  const updateValues = [
    adm_no,
    roll_no,
    name,
    father,
    name_urdu,
    fname_urdu,
    monthly_fee,
    status,
    adm_date,
    adm_standard,
    standard,
    mobile,
    email,
    address,
    gender,
    father_cnic,
    mother_cnic,
    father_profession,
    religion,
    caste,
    previous_school,
    dob_urdu,
    dob,
  ];

  // Handle image upload
  if (req.file) {
    sql += ", image = ?";
    updateValues.push(req.file.path); // Add image path to update values
  }

  sql += " WHERE id = ?";
  updateValues.push(id);

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error("Error updating student: ", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student updated successfully" });
  });
});



  
  // Delete record
  router.delete('/del/:id', checkAuth, (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM basicinfo WHERE id = ?';
    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No student found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    });
});
  

router.get('/classes', (req, res) => {
  const query = 'SELECT * FROM classes'; // Adjust if you have a specific classes table
  db.query(query, (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
  });
});

router.patch('/promote', checkAuth, async (req, res, next) => {
  const updates = req.body; // This will be an array of { adm_no, standard }
  console.log("Received updates:", req.body);

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


// Get student by ID to ownnload form
router.get('/download/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM basicinfo WHERE id = ?';
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(results[0]);
  });
});

router.patch('/promote', checkAuth, async (req, res, next) => {
  const updates = req.body; // This will be an array of { adm_no, standard }
  console.log("Received updates:", req.body);

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



  module.exports = router;