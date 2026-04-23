const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00', // STRICT TIMEZONE COMPLIANCE: Force MySQL session to Asia/Manila
  dateStrings: true // Return dates as strings to avoid JS Date object timezone shifts
});

module.exports = pool;
