const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
destination: function(req, file, cb){
  cb(null, './uploads/staff');
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


// Route to add a new question
router.post("/addq", checkAuth, (req, res) => {
  const { q_standard, subject, chapter, q_type, question, opt1, opt2, opt3, opt4 } = req.body; // Destructure the new options

  // Modify the query to include the new fields
  const query = 'INSERT INTO q_bank (q_standard, subject, chapter, q_type, question, opt1, opt2, opt3, opt4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [q_standard, subject, chapter, q_type, question, opt1, opt2, opt3, opt4], (error, results) => {
      if (error) {
          console.error('Database insert error:', error);
          return res.status(500).json({ error: 'Database insert failed' });
      }
      res.status(201).json({ message: 'Question added successfully', id: results.insertId });
  });
});

router.get('/questions', checkAuth, (req, res, next) => {
  const { standard, subject } = req.query;
  //console.log("Received standard:", standard, "and subject:", subject); // Add this line

  const query = 'SELECT * FROM q_bank LEFT JOIN classes ON classes.sid = q_bank.q_standard WHERE q_standard = ? AND subject = ?';
  
  db.query(query, [standard, subject], (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);  // Return the complete results
  });
});


// Route to fetch all standards
// Route to fetch all standards
router.get('/standards', checkAuth, (req, res) => {
  // Change the query to select standards directly from the classes table
  const query = 'SELECT DISTINCT standard FROM classes'; // Ensure you're getting distinct standards
  db.query(query, (error, results) => {
      if (error) {
          console.error('Database query error while fetching standards:', error);
          return res.status(500).json({ error: 'Failed to fetch standards' });
      }
      res.json(results);
  });
});


// Route to fetch subjects based on the selected standard
// Route to fetch subjects based on the selected standard
router.get('/subjects', checkAuth, (req, res) => {
  const standardId = req.query.standard;
  const query = 'SELECT DISTINCT subject FROM q_bank WHERE q_standard = ?';  // Filter by standard
  db.query(query, [standardId], (error, results) => {
      if (error) {
          console.error('Database query error while fetching subjects:', error);
          return res.status(500).json({ error: 'Failed to fetch subjects' });
      }
      res.json(results);
  });
});


  
 
  router.post("/addqtopaper", checkAuth, (req, res) => {
    const { standard, q_id, marks, exam, examYear } = req.body; // Correctly destructuring exam and examYear
    const query = 'INSERT INTO paper_tbl (standard, q_id, q_marks, exam, examyear) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [standard, q_id, marks, exam, examYear], (error, results) => { // Pass them correctly here
      if (error) {
        console.error('Database insert error:', error);
        return res.status(500).json({ error: 'Database insert failed' });
      }
      res.status(201).json({ message: 'Question added to paper successfully', id: results.insertId });
    });
});

router.get('/questionpaper', checkAuth, (req, res, next) => {
  const { standard, subject, exam, examYear } = req.query;

  const query = `
SELECT paper_tbl.*, q_bank.*, classes.* FROM paper_tbl  
  LEFT JOIN q_bank ON q_bank.qid = paper_tbl.q_id 
  LEFT JOIN classes ON classes.sid = paper_tbl.standard 
  WHERE 
      classes.standard = ? AND 
      q_bank.subject = ? AND 
      paper_tbl.exam = ? AND 
      paper_tbl.examyear = ? AND 
      paper_tbl.q_marks > 0;`;

  db.query(query, [standard, subject, exam, examYear], (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
  });
});


// Route to fetch years and exams
router.get('/exam', checkAuth, (req, res) => {
  const query = 'SELECT DISTINCT exam FROM paper_tbl';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Fetch distinct exam years
router.get('/examyear', checkAuth, (req, res) => {
  const query = 'SELECT DISTINCT examyear FROM paper_tbl';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});



// Route to delete a question from paper_tbl
router.delete('/deleteQuestion/:paperId', checkAuth, (req, res) => {
  const { paperId } = req.params;

  const query = 'DELETE FROM paper_tbl WHERE paper_id = ?'; // Replace paper_id with your actual column name in the database

  db.query(query, [paperId], (error, results) => {
      if (error) {
          console.error('Database delete error:', error);
          return res.status(500).json({ error: 'Database delete failed' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Question not found' });
      }
      res.status(200).json({ message: 'Question deleted successfully' });
  });
});


// Route to update a question
router.put('/questions/:id', checkAuth, (req, res) => {
  const { id } = req.params; // Get the question ID from the URL
  const { chapter, q_type, question, marks } = req.body; // Get updated fields from the body

  const query = 'UPDATE q_bank SET chapter = ?, q_type = ?, question = ?, q_marks = ? WHERE qid = ?';
  db.query(query, [chapter, q_type, question, marks, id], (error, results) => {
      if (error) {
          console.error('Database update error:', error);
          return res.status(500).json({ error: 'Database update failed' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Question not found' });
      }
      res.json({ message: 'Question updated successfully' });
  });
});


  module.exports = router;