const express = require('express');
const router = express.Router();
const mysql = require('mysql');
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



 
// New endpoint for profile or verification 
router.get("/", checkAuth, (req, res) => { 
  const query = 'SELECT standard FROM classes';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    console.log('Results:', results); // Log the results here
    res.json(results);
  });
});


// New endpoint for profile or verification 
router.get("/usercontext", checkAuth, (req, res) => {
  const query = 'SELECT * FROM classes';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});


// Update a specific standard
router.put("/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const { standard } = req.body;
  console.log("Updating standard:", { id, standard });
  const query = 'UPDATE classes SET standard = ? WHERE sid = ?';
  db.query(query, [standard, id], (error, results) => {
    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ error: 'Database update failed' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    res.json({ message: 'Standard updated successfully' });
  });
});



// Add this route in classes.js for fetching a specific class
router.get("/fetche/:sid", checkAuth, (req, res) => {
  const { sid } = req.params; // Get the ID from the URL parameters
  const query = 'SELECT * FROM classes WHERE sid = ?'; 

  db.query(query, [sid], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    res.json(results[0]); // Return the first result
  });
});


 
// Delete a specific standard
router.delete("/:id", checkAuth, (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters
  const query = 'DELETE FROM classes WHERE sid = ?'; // Use 'sid' based on your database design

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Database delete error:', error);
      return res.status(500).json({ error: 'Database delete failed' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    res.json({ message: 'Standard deleted successfully' });
  });
});




// Create a new standard
router.post("/", checkAuth, (req, res) => {
  const { standard } = req.body;
  const query = 'INSERT INTO classes (standard) VALUES (?)';

  db.query(query, [standard], (error, results) => {
      if (error) {
          console.error('Database insert error:', error);
          return res.status(500).json({ error: 'Database insert failed' });
      }
      res.status(201).json({ message: 'Standard created successfully', id: results.insertId });
  });
});


  module.exports = router;