require('dotenv').config();

// STRICT TIMEZONE COMPLIANCE: Force Node.js environment to Asia/Manila
process.env.TZ = 'Asia/Manila';

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3001;

// Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const shiftRoutes = require('./routes/shifts');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leaves');
const departmentRoutes = require('./routes/departments');
const designationRoutes = require('./routes/designations');
const holidayRoutes = require('./routes/holidays');
const dashboardRoutes = require('./routes/dashboard');
const employmentStatusRoutes = require('./routes/employmentStatuses');
const announcementRoutes = require('./routes/announcements');
const assetRoutes = require('./routes/assets');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employment-statuses', employmentStatusRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/assets', assetRoutes);

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

// Initialize Cron Jobs
const { startCron } = require('./cron/attendanceJob');
startCron();

app.listen(PORT, () => {
  console.log(`HRIS Backend Server running on port ${PORT}`);
});
