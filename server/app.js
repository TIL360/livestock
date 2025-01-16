const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

// Allow only techinfolab360.xyz
const corsOptions = {
      origin: ['http://localhost:3000'],
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
const studentRoutes = require('./api/routes/students/students');
const feeRoutes = require('./api/routes/fee/fee');
const userRoutes = require('./api/routes/users/user');
const classesRoutes = require('./api/routes/classes/classes');
const feePaidRoutes = require('./api/routes/fee/feepaid');
const unpaidRoutes = require('./api/routes/fee/unpaid');
const staffRoutes = require('./api/routes/staff/staff');
const salaryRoutes = require('./api/routes/staff/salary');
const resultprepRoutes = require('./api/routes/result/resultprep');
const attendanceRoutes = require('./api/routes/attendance/attendance');
const attsheetRoutes = require('./api/routes/attendance/attsheet');
const resultRoutes = require('./api/routes/result/result');
const datesheetRoutes = require('./api/routes/result/datesheet');
const infoRoutes = require('./api/routes/info/info');
const paperRoutes = require('./api/routes/question/paperserver');
const feestatsRoutes = require('./api/routes/fee/feestats');
const countRoutes = require('./api/routes/counter/count');
const tasksRoutes = require('./api/routes/tasking/tasks');
const invoiceRoutes = require('./api/routes/fee/invoicefee');
const expRoutes = require('./api/routes/expenses/expenses');



app.use('/students', studentRoutes);
app.use('/fee', feeRoutes);
app.use('/user', userRoutes);
app.use('/classes', classesRoutes);
app.use('/feepaid', feePaidRoutes);
app.use('/unpaid', unpaidRoutes);
app.use('/staff', staffRoutes);
app.use('/salary', salaryRoutes);
app.use('/resultprep', resultprepRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/attsheet', attsheetRoutes);
app.use('/result', resultRoutes);
app.use('/tasks', tasksRoutes);
app.use('/datesheet', datesheetRoutes);
app.use('/info', infoRoutes);
app.use('/paperserver', paperRoutes);
app.use('/feestats', feestatsRoutes);
app.use('/count', countRoutes);
app.use('/invoicefee', invoiceRoutes);
app.use('/expenses', expRoutes);


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
