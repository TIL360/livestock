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

// Add Expense
router.post('/add', checkAuth, (req, res) => {
  const { detail, date, amount, M_Raza, Aamer_Raza, Rasheed_K, Remarks, created_by, updated_by } = req.body;
  
  // Get current date in yyyy-mm-dd format
  const currentDate = new Date().toISOString().slice(0, 10);

  const sql = `
      INSERT INTO expense_tbl 
      (detail, date, amount, M_Raza, Aamer_Raza, Rasheed_K, Remarks, created_by, updated_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [detail, date, amount, M_Raza, Aamer_Raza, Rasheed_K, Remarks, created_by, updated_by, currentDate], (err, result) => {
      if (err) {
          console.error('Error inserting expense:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId });
  });
});






// Get All Expenses
router.get('/', checkAuth, (req, res) => {
  const sql = 'SELECT * FROM expense_tbl ORDER BY created_at DESC';
  db.query(sql, (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
  });
});


// Get Distinct Years
router.get('/years', checkAuth, (req, res) => {
  const sql = 'SELECT DISTINCT year FROM expense_tbl';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching years:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get Distinct Months
router.get('/months', checkAuth, (req, res) => {
  const sql = 'SELECT DISTINCT month FROM expense_tbl';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching months:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Get Expense by ID
router.get('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM expense_tbl WHERE expense_id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error fetching expense:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: 'Expense not found' });
      }
      res.json(result[0]);
  });
});


// Update Expense
router.patch('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  const { detail, date, amount, M_Raza, Aamer_Raza, Rasheed_K, Remarks, updated_by } = req.body;
  
  // Get current date in yyyy-mm-dd format
  const currentDate = new Date().toISOString().slice(0, 10);

  const sql = `
      UPDATE expense_tbl
      SET detail = ?, date = ?, amount = ?, M_Raza = ?, Aamer_Raza = ?, Rasheed_K = ?, Remarks = ?, updated_at = ?, updated_by = ?
      WHERE expense_id = ?
  `;
  db.query(sql, [detail, date, amount, M_Raza, Aamer_Raza, Rasheed_K, Remarks, currentDate, updated_by, id], (err, result) => {
      if (err) {
          console.error('Error updating expense:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Expense updated successfully' });
  });
});




// Delete Expense
// Delete Expense
router.delete('/:id', checkAuth, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM expense_tbl WHERE expense_id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error deleting expense:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Expense not found' });
      }
      res.status(200).json({ message: 'Expense deleted successfully' });
  });
});

// Get Total Monthly Expenses
router.get('/total-monthly', checkAuth, (req, res) => {
  const sql = `
      SELECT amount FROM expense_tbl 
      WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching total monthly expenses:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ total: results[0].total_expenses || 0 });
  });
});



module.exports = router;
