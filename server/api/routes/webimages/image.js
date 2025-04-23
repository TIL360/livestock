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
    file.mimetype === "image/gif" // Added GIF support
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
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
 // Endpoint to upload an image
router.post("/", checkAuth, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.filename : null; // Get image filename
  
  if (!title || !description || !imagePath) {
    return res.status(400).json({ error: 'Title, description, and image are required.' });
  }

  // Insert data into the database
  const sql = 'INSERT INTO images (title, description, photo) VALUES (?, ?, ?)';
  db.query(sql, [title, description, imagePath], (err, result) => {
    if (err) {
      console.error('Error inserting image record:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, title, description, photo: imagePath });
  });
});


// Endpoint to fetch an image by ID
// Endpoint to fetch an image by ID
router.get("/edit/:id", (req, res) => {
  const imageId = req.params.id;
  console.log(imageId);
  const query = 'SELECT * FROM images WHERE id = ?';
  db.query(query, [imageId], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(results[0]); // Return the first result
  });
});


// Endpoint to update an image
router.patch("/update/:id", checkAuth, upload.single('photo'), (req, res) => {
  const { title, description } = req.body;
  const oldPhoto = req.body.oldPhoto || null; // Capture the old photo name if it exists
  const imagePath = req.file ? req.file.filename : oldPhoto; // Use new image if uploaded, otherwise use old

  const imageId = req.params.id;

  const sql = 'UPDATE images SET title = ?, description = ?, photo = ? WHERE id = ?';
  const values = [title, description, imagePath, imageId];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating image record:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Image not found' });
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
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image not found' });
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
