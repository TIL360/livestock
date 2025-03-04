const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const axios = require('axios'); // Import axios

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.use(cors()); // Fixes mentioned typo here

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
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

// Endpoint to initiate payment
router.post('/initiate-payment', async (req, res) => {
  const { amount, userId } = req.body;
  try {
      const response = await axios.post('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
          merchantId: MERCHANT_ID, // Ensure these constants are defined
          amount: amount,
          commonParams: {
              returnUrl: 'http://localhost:3000/payment-success',
              userId: userId,
          }
      }, {
          headers: {
              'Content-Type': 'application/json',
              'X-VERIFY': API_KEY, // Ensure these constants are defined
          }
      });

      return res.json(response.data);
    }  catch (error) {
      console.error('Error initiating payment:', error);
      return res.status(500).json({ error: 'Error initiating payment' });
    }
  });
  

module.exports = router;
