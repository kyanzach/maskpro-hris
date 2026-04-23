const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// @route   GET /api/employees
// @desc    Get all employees joined with Unify users table
// @access  Private (Admin/HR)
router.get('/', authorize(), async (req, res) => {
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
                h.department_id,
                h.designation_id,
                h.employment_status_id,
                h.shift_id,
                h.base_hourly_rate,
                h.overtime_rate,
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
            WHERE u.is_active = 1 AND (u.branch_id IS NULL OR u.branch_id != 2)
            ORDER BY u.full_name ASC
        `;
        
        const [employees] = await pool.query(query);
        
        // Strip sensitive base_hourly_rate if the requester is NOT super admin
        const isSuperAdmin = ['ryan', 'karen'].includes(req.user.username);
        
        const formattedEmployees = employees.map(emp => {
            if (!isSuperAdmin) {
                delete emp.base_hourly_rate;
                delete emp.overtime_rate;
            }
            return emp;
        });

        res.json({ success: true, data: formattedEmployees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ success: false, message: 'Server error fetching employees' });
    }
});
// @route   PUT /api/employees/:user_id
// @desc    Update employee HR profile mapping
// @access  Private (Admin/HR)
router.put('/:user_id', authorize(['admin', 'hr']), async (req, res) => {
    try {
        const { user_id } = req.params;
        const { 
            biometric_uid, 
            department_id, 
            designation_id, 
            employment_status_id, 
            shift_id, 
            base_hourly_rate, 
            overtime_rate 
        } = req.body;

        // Check if hr_employees record exists
        const [existing] = await pool.query('SELECT id FROM hr_employees WHERE user_id = ?', [user_id]);

        if (existing.length === 0) {
            // Insert
            await pool.query(`
                INSERT INTO hr_employees (user_id, biometric_uid, department_id, designation_id, employment_status_id, shift_id, base_hourly_rate, overtime_rate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [user_id, biometric_uid || null, department_id || null, designation_id || null, employment_status_id || null, shift_id || null, base_hourly_rate || 0, overtime_rate || 0]);
        } else {
            // Update
            // Only update rate/bonus if provided (or if super admin, though middleware currently allows admin)
            await pool.query(`
                UPDATE hr_employees 
                SET biometric_uid = ?, department_id = ?, designation_id = ?, employment_status_id = ?, shift_id = ?, base_hourly_rate = COALESCE(?, base_hourly_rate), overtime_rate = COALESCE(?, overtime_rate)
                WHERE user_id = ?
            `, [biometric_uid || null, department_id || null, designation_id || null, employment_status_id || null, shift_id || null, base_hourly_rate, overtime_rate, user_id]);
        }

        res.json({ success: true, message: 'Employee profile updated successfully' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ success: false, message: 'Server error updating employee' });
    }
});

module.exports = router;
