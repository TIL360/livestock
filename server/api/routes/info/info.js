const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/announcements");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
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

// Create Announcement
router.post('/add', checkAuth, upload.single('image'), (req, res) => {
  try {
    const { title, description, created_by } = req.body;
    console.log(req.body);
    const imagePath = req.file ? req.file.path : null;

    const sql = 'INSERT INTO accouncements (title, description, created_by, image) VALUES (?, ?, ?, ?)';

    
    db.query(sql, [title, description, created_by, imagePath], (err, result) => {
      if (err) {
        console.error('Error inserting announcement:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId });
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Announcements
router.get('/', (req, res) => {
  try {
    db.query('SELECT * FROM accouncements ORDER BY id DESC', (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Edit Announcement
router.patch('/:id', checkAuth, upload.single('image'), (req, res) => {
  const id = req.params.id; // Get id from URL params instead
  const { title, description, updated_by } = req.body;

  let sql;
  let updateValues;

  console.log(req.file); // Check file information

  if (req.file) {
    const imagePath = req.file.path; // Ensure this points correctly to your uploads directory
    sql = 'UPDATE accouncements SET title = ?, description = ?, updated_at = NOW(), updated_by = ?, image = ? WHERE id = ?';
    updateValues = [title, description, updated_by, imagePath, id];
  } else {
    sql = 'UPDATE accouncements SET title = ?, description = ?, updated_at = NOW(), updated_by = ? WHERE id = ?';
    updateValues = [title, description, updated_by, id];
  }

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating announcement:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Announcement updated successfully' });
  });
});

// Delete Announcement
router.delete('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM accouncements WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting announcement:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully' });
  });
});

// Get Announcement by ID
router.get('/:id', checkAuth, (req, res) => {
  const id = (req.params.id);
  
  const sql = 'SELECT * FROM accouncements WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching announcement:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(result[0]);
  });
});

module.exports = router;
