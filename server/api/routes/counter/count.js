const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
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
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Endpoint to get the current visit count
router.get('/', (req, res) => {
    db.query('SELECT count FROM visits WHERE id = 1', (err, results) => {
     if(results){
  
       res.status(200).json(results[0]);
     }
     if(err){
      console.error("Error incrementing visit count:", err);
      return res.status(500).json({ error: "Database error" });
     }
    });
  });
  
  // Endpoint to increment the visit count
  router.patch('/visitadd', (req, res) => {
    db.query('UPDATE visits SET count = count + 1 WHERE id = 1', (err, results) => {
      if (err) {
        console.error("Error incrementing visit count:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).send('Count incremented.');
    });
  });

module.exports = router;
