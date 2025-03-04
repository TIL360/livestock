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




router.patch('/update', checkAuth, async (req, res, next) => {
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