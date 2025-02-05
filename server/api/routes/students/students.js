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
  const query = 'SELECT * FROM basicinfo';
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
 
router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
  
  // Destructure the necessary fields from req.body
  const { admno, name, standard, section, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email, rollno, dob } = req.body;

  // Check if the file was uploaded
  const imagePath = req.file ? req.file.path : null; // Get image path or set to null if no file

  // Prepare the SQL statement based on whether there is an image
  const sql = 'INSERT INTO basicinfo (adm_no, name, standard, section, image, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email, roll_no, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
  
  // Insert data into the database
  db.query(sql, [admno, name, standard, section, imagePath, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email, rollno, dob], (err, result) => {
      if (err) {
          console.error('Error inserting student: ', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, admno, name, standard });
  });
});


// Handling GET by admno
router.get('/edit/:id', checkAuth, (req, res, next) => {
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
  
  router.patch('/:id', checkAuth, upload.single('image'), (req, res, next) => {
    const id = req.params.id;
    const { admno, name, standard, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email } = req.body;

    // Start constructing the SQL query
    let sql = 'UPDATE basicinfo SET adm_no = ?, name = ?, standard = ?, monthly_fee = ?, status = ?, father = ?, adm_date = ?, adm_standard = ?, mobile = ?, address = ?, email = ?, updated_at = NOW()';
    const updateValues = [admno, name, standard, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email];

    if (req.file) { // A new image exists
        const imagePath = req.file.path; // Use the image path from the uploaded file
        sql += ', image = ?'; // Append the image update
        updateValues.push(imagePath); // Add the new image path
    }

    sql += ' WHERE id = ?'; // Specify the record to update with WHERE clause
    updateValues.push(id); // The id of the record to identify which student to update

    // Execute the update query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating student: ', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    });
});



  
  // Delete record
  router.delete('/del/:id', checkAuth, (req, res, next) => {
    const studentId = req.params.id;
    console.log(`Delete request received for adm_no: ${studentId}`);
    
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
  

  router.get('/classes', (req, res, next) => {
    const query = 'SELECT * FROM basicinfo';
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



  module.exports = router;