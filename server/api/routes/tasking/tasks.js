const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
require('dotenv').config();
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
// Get unique task standards
router.get("/standards", checkAuth, (req, res) => {
  db.query("SELECT standard FROM classes", (err, results) => {
    if (err) {
      console.error("Error fetching standards:", err);
      return res.status(500).json({ success: false, error: "Database query failed" });
    }
    res.json({ success: true, data: results });
  });
});

// Get unique created_task_at options
// Get unique created_task_at options
router.get("/created-at-options", checkAuth, (req, res) => {
  db.query("SELECT DISTINCT created_task_at FROM syllabus", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    // Results will now have the date only in YYYY-MM-DD format as stored in the database
    res.json({ data: results });
  });
});

router.get("/", checkAuth, async (req, res) => {
  const { task_standard, created_task_at, user } = req.query;
  //console.log("Received query parameters:", req.query);

  let query = 'SELECT * FROM syllabus WHERE user = ?';
  const queryParams = [user];

  if (task_standard) {
    query += ' AND task_standard = ?';
    queryParams.push(task_standard);
  }

  if (created_task_at) {
    query += ' AND created_task_at = ?';
    queryParams.push(created_task_at);
  }

  //console.log("Executing query:", query, "with params:", queryParams);
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log("Query results:", results);
    res.json({ data: results });
  });
});



router.get("/view", (req, res) => { 
  const { admno } = req.query;

  // Sanitize and validate admno if necessary
  if (!admno) {
      return res.status(400).json({ error: "Admission number is required" });
  }

  const query = `SELECT syllabus.*, basicinfo.* FROM syllabus 
  JOIN basicinfo ON syllabus.task_standard = basicinfo.standard 
  WHERE basicinfo.adm_no = ?`;

  
  const queryParams = [admno];

  db.query(query, queryParams, (err, results) => { 
      if (err) { 
          console.error(err); // Consider logging the error for debugging 
          return res.status(500).json({ error: "Database query failed" }); 
      }
      
      // Check if results are empty
      if (results.length === 0) {
        return res.status(404).json({ error: "No results found" });
    }
    res.json({ data: results }); // Ensure you are adjusting the frontend to access this structure
    
  });
});


// Post a new task
router.post("/new-task", checkAuth, (req, res) => {
  const { user, task_standard, subject, task, created_task_at } = req.body;

  const query = `
      INSERT INTO syllabus (user, task_standard, subject, task, created_task_at) 
      VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [user, task_standard, subject, task, created_task_at], (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.status(201).json({ success: true, message: "Task created successfully", data: result });
  });
});




// Delete a task by ID
router.delete("/:syllabus_id", checkAuth, (req, res) => {
  const taskId = req.params.syllabus_id; // Here is the issue, you should use req.params.taskid

  const query = "DELETE FROM syllabus WHERE syllabus_id = ?";

  db.query(query, [taskId], (error, result) => {
    if (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  });
});

router.get("/:syllabus_id", checkAuth, (req, res) => {
  const syllabusId = req.params.syllabus_id;
  const query = "SELECT * FROM syllabus WHERE syllabus_id = ?";
  db.query(query, [syllabusId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(results[0]); // Return the first result object
  });
});
// Update a task by ID
router.patch("/:syllabus_id", checkAuth, (req, res) => {
  const taskId = req.params.syllabus_id;
  const { task_standard, subject, task } = req.body;
console.log(req.standard);
const currentDate = new Date();
  // Update the task in the database
  const query = `
      UPDATE syllabus 
      SET task_standard = ?, subject = ?, task = ?, updated_at = ? 
      WHERE syllabus_id = ?`;

  db.query(query, [task_standard, subject, task, currentDate, taskId ], (error, result) => {
      if (error) {
          console.error("Error updating task:", error);
          return res.status(500).json({ error: "Database query failed" });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({ success: true, message: "Task updated successfully" });
  });
});

// Get unique task standards from syllabus table
router.get("/taskSD", checkAuth, (req, res) => {
  db.query("SELECT task_standard FROM syllabus", (err, results) => {
    if (err) {
      console.error("Error fetching standards:", err);
      return res.status(500).json({ success: false, error: "Database query failed" });
    }
    res.json({ success: true, data: results });
  });
});
module.exports = router;
 
  