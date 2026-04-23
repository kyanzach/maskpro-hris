const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all holidays
router.get('/', authorize(), async (req, res) => {
    try {
        const [holidays] = await pool.query('SELECT * FROM hr_holidays ORDER BY start_date DESC');
        res.json({ success: true, data: holidays });
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create holiday
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { name, start_date, end_date, type } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hr_holidays (name, start_date, end_date, type) VALUES (?, ?, ?, ?)',
            [name, start_date, end_date, type || 'Regular']
        );
        res.json({ success: true, message: 'Holiday created', id: result.insertId });
    } catch (error) {
        console.error('Error creating holiday:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update holiday
router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { name, start_date, end_date, type } = req.body;
        await pool.query(
            'UPDATE hr_holidays SET name = ?, start_date = ?, end_date = ?, type = ? WHERE id = ?',
            [name, start_date, end_date, type, req.params.id]
        );
        res.json({ success: true, message: 'Holiday updated' });
    } catch (error) {
        console.error('Error updating holiday:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE holiday
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_holidays WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Holiday deleted' });
    } catch (error) {
        console.error('Error deleting holiday:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
