const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// @route   GET /api/shifts
// @desc    Get all working shifts
// @access  Private
router.get('/', authorize(), async (req, res) => {
    try {
        const [shifts] = await pool.query('SELECT * FROM hr_shifts ORDER BY start_time ASC');
        res.json({ success: true, data: shifts });
    } catch (error) {
        console.error('Error fetching shifts:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/shifts
// @desc    Create a new shift
// @access  Private (Admin)
router.post('/', authorize(['admin', 'hr']), async (req, res) => {
    try {
        const { name, start_time, end_time, is_default } = req.body;
        
        if (is_default) {
            await pool.query('UPDATE hr_shifts SET is_default = FALSE');
        }

        const [result] = await pool.query(
            'INSERT INTO hr_shifts (name, start_time, end_time, is_default) VALUES (?, ?, ?, ?)',
            [name, start_time, end_time, is_default || false]
        );

        res.json({ success: true, message: 'Shift created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating shift:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
