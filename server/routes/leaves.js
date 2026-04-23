const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// @route   GET /api/leaves
// @desc    Get all leaves
// @access  Private
router.get('/', authorize(), async (req, res) => {
    try {
        const query = `
            SELECT 
                l.id,
                l.type,
                l.start_date,
                l.end_date,
                l.reason,
                l.status,
                u.full_name
            FROM hr_leaves l
            INNER JOIN hr_employees h ON l.employee_id = h.id
            INNER JOIN users u ON h.user_id = u.id
            ORDER BY l.created_at DESC
        `;
        const [leaves] = await pool.query(query);
        res.json({ success: true, data: leaves });
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/leaves
// @desc    Create a leave request
// @access  Private
router.post('/', authorize(), async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, start_date, end_date, reason } = req.body;

        const [emp] = await pool.query('SELECT id FROM hr_employees WHERE user_id = ?', [userId]);
        if (!emp.length) return res.status(404).json({ success: false, message: 'HR Profile not found' });

        await pool.query(
            'INSERT INTO hr_leaves (employee_id, type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [emp[0].id, type, start_date, end_date, reason, 'Pending']
        );

        res.json({ success: true, message: 'Leave request submitted' });
    } catch (error) {
        console.error('Error creating leave:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/leaves/:id/status
// @desc    Update leave status
// @access  Private (Admin/HR)
router.put('/:id/status', authorize(['admin', 'hr']), async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE hr_leaves SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true, message: 'Leave status updated' });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
