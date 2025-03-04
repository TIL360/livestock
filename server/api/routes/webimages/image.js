const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
require('dotenv').config();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/webimages");
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

// Endpoint to fetch all images
router.get("/", checkAuth, (req, res) => {
    const query = 'SELECT * FROM images';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });
  
  // Endpoint to upload an image
  router.post("/", checkAuth, upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Get image filename
  
    // Insert data into the database
    const sql = 'INSERT INTO images (title, description, photo) VALUES (?, ?, ?)';
    db.query(sql, [title, description, imagePath], (err, result) => {
      if (err) {
        console.error('Error inserting image record:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, title, description });
    });
  });

// Add these routes to your existing router

// Endpoint to update an image
router.put("/:id", checkAuth, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.filename : null; // Get image filename
  const imageId = req.params.id;

  // Update data in the database
  const sql = 'UPDATE images SET title = ?, description = ?, photo = ? WHERE id = ?';
  db.query(sql, [title, description, imagePath || null, imageId], (err, result) => {
    if (err) {
      console.error('Error updating image record:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Image updated successfully' });
  });
});

// Endpoint to delete an image
router.delete("/:id", checkAuth, (req, res) => {
  const imageId = req.params.id;

  // Delete data from the database
  const sql = 'DELETE FROM images WHERE id = ?';
  db.query(sql, [imageId], (err, result) => {
    if (err) {
      console.error('Error deleting image record:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(204).json({ message: 'Image deleted successfully' });
  });
});

// Endpoint to fetch all images
router.get("/webimage", (req, res) => {
  const query = 'SELECT * FROM images';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});
module.exports = router;
