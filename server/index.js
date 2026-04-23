require('dotenv').config();

// STRICT TIMEZONE COMPLIANCE: Force Node.js environment to Asia/Manila
process.env.TZ = 'Asia/Manila';

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

const PORT = process.env.PORT || 3001;

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const shiftRoutes = require('./routes/shifts');
const attendanceRoutes = require('./routes/attendance');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);

// Basic Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    // Test DB Connection
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ status: 'ok', db_connected: rows[0].result === 2 });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`HRIS Backend Server running on port ${PORT}`);
});
