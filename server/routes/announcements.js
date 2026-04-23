const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all announcements
router.get('/', authorize(), async (req, res) => {
    try {
        const [announcements] = await pool.query(`
            SELECT a.*, u.full_name as created_by_name 
            FROM hr_announcements a 
            LEFT JOIN users u ON a.created_by = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json({ success: true, data: announcements });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create announcement
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { title, body, start_date, end_date } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hr_announcements (title, body, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, body, start_date, end_date, req.user.id]
        );
        res.json({ success: true, message: 'Announcement created', id: result.insertId });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE announcement
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_announcements WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Announcement deleted' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
