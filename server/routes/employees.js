const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

// @route   GET /api/employees
// @desc    Get all employees joined with Unify users table
// @access  Private (Admin/HR)
router.get('/', requireAuth, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id as user_id, 
                u.username, 
                u.full_name, 
                u.job_title as unify_job_title, 
                u.access_level, 
                u.is_active,
                u.branch_id,
                h.id as hr_id,
                h.biometric_uid,
                h.base_hourly_rate,
                h.bonus_percentage,
                d.name as department_name,
                des.name as designation_name,
                s.name as employment_status,
                sh.name as shift_name,
                sh.start_time,
                sh.end_time
            FROM users u
            INNER JOIN hr_employees h ON u.id = h.user_id
            LEFT JOIN hr_departments d ON h.department_id = d.id
            LEFT JOIN hr_designations des ON h.designation_id = des.id
            LEFT JOIN hr_employment_statuses s ON h.employment_status_id = s.id
            LEFT JOIN hr_shifts sh ON h.shift_id = sh.id
            ORDER BY u.full_name ASC
        `;
        
        const [employees] = await pool.query(query);
        
        // Strip sensitive base_hourly_rate if the requester is NOT super admin
        const isSuperAdmin = ['ryan', 'karen'].includes(req.user.username);
        
        const formattedEmployees = employees.map(emp => {
            if (!isSuperAdmin) {
                delete emp.base_hourly_rate;
                delete emp.bonus_percentage;
            }
            return emp;
        });

        res.json({ success: true, data: formattedEmployees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ success: false, message: 'Server error fetching employees' });
    }
});

module.exports = router;
