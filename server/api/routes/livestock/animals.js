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



 

// New endpoint for profile or verification
// GET all active goats
router.get('/', checkAuth, (req, res) => {
  const query = 'SELECT * FROM goat_tbl WHERE status="Active"'; // or adjust as needed
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

router.get('/sold', checkAuth, (req, res) => {
  const query = 'SELECT * FROM goat_tbl WHERE status = "Sold Out"'; // adjust as needed
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
 
// POST create new goat
// POST create goat
router.post('/', checkAuth, upload.single('image'), (req, res) => {
  try {
    const {
      description,
      cost,
      purchase_date,
      status,
      type,
      sell_amount,
      age
    } = req.body;

    const imagePath = req.file ? req.file.path : null;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      INSERT INTO goat_tbl (
        description,
        image,
        cost,
        purchase_date,
        created_at,
        status,
        type,
        sell_amount,
        age
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      description,
      imagePath,
      cost,
      purchase_date,
      created_at,
      status || 'Active',
      type || 'Purchased',
      sell_amount || null,
      age || null
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting goat:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, description });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH update goat
router.patch('/:id', checkAuth, upload.single('image'), (req, res) => {
  const id = req.params.id;
  const {
    description,
    cost,
    purchase_date,
    status,
    type,
    sell_amount,
    age
  } = req.body;

  let sql = `
    UPDATE goat_tbl SET
      description = ?,
      cost = ?,
      purchase_date = ?,
      status = ?,
      type = ?,
      sell_amount = ?,
      age = ?
  `;
  const updateValues = [description, cost, purchase_date, status, type, sell_amount, age];

  // Append image if uploaded
  if (req.file) {
    sql += `, image = ?`;
    updateValues.push(req.file.path);
  }

  sql += ` WHERE id = ?`;
  updateValues.push(id);

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Goat not found' });
    }
    res.json({ message: 'Goat updated successfully' });
  });
});



router.get('/goatsall', async (req, res) => {
  const query = 'SELECT * FROM goat_tbl WHERE status = "Active"'; // adjust as needed
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});



  
router.get('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  console.log('Attempting to fetch goat with id:', id);
  const query = 'SELECT * FROM goat_tbl WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      console.warn('No goat found with id:', id);
      return res.status(404).json({ message: 'Goat not found' });
    }
    console.log('Found goat:', results[0]);
    res.json(results[0]);
  });
});






  
  // Delete record
// DELETE goat
router.delete('/del/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM goat_tbl WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Goat not found' });
    }
    res.json({ message: 'Goat deleted successfully' });
  });
});
  






  module.exports = router;