const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET dashboard stats
router.get('/stats', authorize(), async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [[totalEmp]] = await pool.query('SELECT COUNT(*) as count FROM hr_employees');
        const [[activeEmp]] = await pool.query('SELECT COUNT(*) as count FROM hr_employees h INNER JOIN users u ON h.user_id = u.id WHERE u.is_active = 1');
        const [[presentToday]] = await pool.query('SELECT COUNT(*) as count FROM hr_attendance WHERE punch_date = ? AND status = "Present"', [today]);
        const [[onLeave]] = await pool.query('SELECT COUNT(*) as count FROM hr_leaves WHERE status = "Approved" AND ? BETWEEN start_date AND end_date', [today]);
        const [[pendingLeaves]] = await pool.query('SELECT COUNT(*) as count FROM hr_leaves WHERE status = "Pending"');
        const [[upcomingHolidays]] = await pool.query('SELECT COUNT(*) as count FROM hr_holidays WHERE start_date >= ?', [today]);

        // Recent activity
        const [recentAttendance] = await pool.query(`
            SELECT u.full_name, a.in_time, a.status, 'attendance' as activity_type
            FROM hr_attendance a 
            INNER JOIN hr_employees h ON a.employee_id = h.id 
            INNER JOIN users u ON h.user_id = u.id 
            WHERE a.punch_date = ? 
            ORDER BY a.in_time DESC LIMIT 5
        `, [today]);

        const [recentLeaves] = await pool.query(`
            SELECT u.full_name, l.type, l.status, l.created_at, 'leave' as activity_type
            FROM hr_leaves l 
            INNER JOIN hr_employees h ON l.employee_id = h.id 
            INNER JOIN users u ON h.user_id = u.id 
            ORDER BY l.created_at DESC LIMIT 5
        `);

        res.json({
            success: true,
            data: {
                total_employees: totalEmp.count,
                active_employees: activeEmp.count,
                present_today: presentToday.count,
                on_leave: onLeave.count,
                pending_leaves: pendingLeaves.count,
                upcoming_holidays: upcomingHolidays.count,
                recent_attendance: recentAttendance,
                recent_leaves: recentLeaves
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
