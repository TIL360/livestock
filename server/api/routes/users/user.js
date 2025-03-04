const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-atuh');
require('dotenv').config();





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
    console.log('Connected to MySQL database');
});



// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized!" });
      req.userId = decoded.userid;
      next();
  });
};

// Endpoint to get the current visit count
router.get('/visits', (req, res) => {
  db.query('SELECT count FROM visits WHERE id = 1', (err, results) => {
    if (err) {
      console.error("Error fetching visit count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results[0]);
  });
});

// Endpoint to increment the visit count
router.patch('/visits', (req, res) => {
  db.query('UPDATE visits SET count = count + 1 WHERE id = 1', (err, results) => {
    if (err) {
      console.error("Error incrementing visit count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).send('Count incremented.');
  });
});


// New endpoint for profile or verification
router.get("/", verifyToken, (req, res) => {
  // You can add further logic to fetch user details if needed
  res.status(200).json({ Valid: true }); // This is just an example response
});



// Handling POST requests for signup
router.post("/signup", (req, res) => {
  const { username, password, usertype } = req.body;
console.log(usertype);
  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: err.message });
    }

    // Insert into the database
    const sql = "INSERT INTO user_detail (username, password, usertype) VALUES (?, ?, ?)";
    db.query(sql, [username, hash, usertype], (err, result) => {
      if (err) {
        console.error("Error inserting user: ", err);
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.status(201).json({ id: result.insertId, username, usertype });
    });
  });
});


// Handling POST requests for login

router.post('/login', cors(), (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM user_detail WHERE username = ?";
  
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    
    if (!results.length) return res.status(401).json({ message: "Auth failed. User not found." });

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: "Auth failed. Invalid credentials." });
      }

     const token = jwt.sign(
  {
    username: results[0].username,
    userid: results[0].id,
  },
  process.env.JWT_KEY || 'BzjG0Wnf8f', // add a fallback secret key
  { expiresIn: "2h" }
);


      return res.status(200).json({ message: "Auth successful.", token, user: { username: results[0].username, usertype: results[0].usertype } });
    });
  });
});



// Handling POST requests for changing password
router.post("/change-password", checkAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Log the incoming request
  console.log('Request to change password:', { userId: req.userId, currentPassword, newPassword });

  const sql = "SELECT * FROM user_detail WHERE id = ?";
  db.query(sql, [req.userId], (err, results) => {
    if (err) {
      console.error("Database error when fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!results.length) {
      console.log("User not found for userId:", req.userId);
      return res.status(401).json({ message: "User not found." });
    }

    // Compare current password
    bcrypt.compare(currentPassword, results[0].password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Error comparing passwords." });
      }

      if (!isMatch) {
        console.log("Current password is incorrect for userId:", req.userId);
        return res.status(401).json({ message: "Current password is incorrect." });
      }

      // Hash and update the new password
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing new password:", err);
          return res.status(500).json({ error: err.message });
        }

        const updateSql = "UPDATE user_detail SET password = ? WHERE id = ?";
        db.query(updateSql, [hash, req.userId], (err) => {
          if (err) {
            console.error("Error updating password: ", err);
            return res.status(500).json({ error: "Database error: " + err.message });
          }

          res.status(200).json({ message: "Password changed successfully." });
        });
      });
    });
  });
});




module.exports = router;

