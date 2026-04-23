const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all assets
router.get('/', authorize(), async (req, res) => {
    try {
        const [assets] = await pool.query(`
            SELECT a.*, u.full_name as assigned_to_name 
            FROM hr_assets a 
            LEFT JOIN hr_employees h ON a.assigned_to = h.id
            LEFT JOIN users u ON h.user_id = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json({ success: true, data: assets });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create asset
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { name, serial_number, type, assigned_to, notes } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hr_assets (name, serial_number, type, assigned_to, notes) VALUES (?, ?, ?, ?, ?)',
            [name, serial_number, type, assigned_to, notes]
        );
        res.json({ success: true, message: 'Asset created', id: result.insertId });
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE asset
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_assets WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Asset deleted' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
