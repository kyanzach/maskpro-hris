const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all employment statuses
router.get('/', authorize(), async (req, res) => {
    try {
        const [statuses] = await pool.query(`
            SELECT es.*, COUNT(h.id) as employee_count 
            FROM hr_employment_statuses es 
            LEFT JOIN hr_employees h ON h.employment_status_id = es.id 
            GROUP BY es.id 
            ORDER BY es.name ASC
        `);
        res.json({ success: true, data: statuses });
    } catch (error) {
        console.error('Error fetching employment statuses:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create employment status
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { name, color_code } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hr_employment_statuses (name, color_code) VALUES (?, ?)',
            [name, color_code || '#6366f1']
        );
        res.json({ success: true, message: 'Employment status created', id: result.insertId });
    } catch (error) {
        console.error('Error creating employment status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update employment status
router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { name, color_code } = req.body;
        await pool.query(
            'UPDATE hr_employment_statuses SET name = ?, color_code = ? WHERE id = ?',
            [name, color_code || '#6366f1', req.params.id]
        );
        res.json({ success: true, message: 'Employment status updated' });
    } catch (error) {
        console.error('Error updating employment status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE employment status
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_employment_statuses WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Employment status deleted' });
    } catch (error) {
        console.error('Error deleting employment status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
