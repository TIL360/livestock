const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

// Allow only techinfolab360.xyz
const corsOptions = {
      origin: ['http://localhost:3002'],
      methods: 'GET,POST,PATCH,DELETE',
    credentials: true, // Include if you need to send cookies or authentication headers

};

app.use(cors(corsOptions));




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

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));


// Your existing routes
const animalsRoutes = require('./api/routes/livestock/animals');
const userRoutes = require('./api/routes/users/user');
const applyRoutes = require('./api/routes/livestock/apply');
const expensesRoutes = require('./api/routes/expenses/expenses');
const infoRoutes = require('./api/routes/info/info');
const statsRoutes = require('./api/routes/dynamicdb/stats');



// routes description
app.use('/animals', animalsRoutes);
app.use('/user', userRoutes);
app.use('/apply', applyRoutes);
app.use('/expenses', expensesRoutes);
app.use('/info', infoRoutes);
app.use('/stats', statsRoutes);



app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
