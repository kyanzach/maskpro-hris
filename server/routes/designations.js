const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all designations
router.get('/', authorize(), async (req, res) => {
    try {
        const [designations] = await pool.query(`
            SELECT * 
            FROM hr_designations 
            ORDER BY name ASC
        `);
        res.json({ success: true, data: designations });
    } catch (error) {
        console.error('Error fetching designations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create designation
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hr_designations (name, description) VALUES (?, ?)',
            [name, description]
        );
        res.json({ success: true, message: 'Designation created', id: result.insertId });
    } catch (error) {
        console.error('Error creating designation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update designation
router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        await pool.query(
            'UPDATE hr_designations SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );
        res.json({ success: true, message: 'Designation updated' });
    } catch (error) {
        console.error('Error updating designation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE designation
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_designations WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Designation deleted' });
    } catch (error) {
        console.error('Error deleting designation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
