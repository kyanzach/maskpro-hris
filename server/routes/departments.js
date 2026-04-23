const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');

// GET all departments
router.get('/', authorize(), async (req, res) => {
    try {
        const [departments] = await pool.query(`
            SELECT d.*, COUNT(h.id) as employee_count 
            FROM hr_departments d 
            LEFT JOIN hr_employees h ON h.department_id = d.id 
            GROUP BY d.id 
            ORDER BY d.name ASC
        `);
        res.json({ success: true, data: departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST create department
router.post('/', authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        const [result] = await pool.query('INSERT INTO hr_departments (name, description) VALUES (?, ?)', [name, description]);
        res.json({ success: true, message: 'Department created', id: result.insertId });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT update department
router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { name, description } = req.body;
        await pool.query('UPDATE hr_departments SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
        res.json({ success: true, message: 'Department updated' });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE department
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_departments WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Department deleted' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
