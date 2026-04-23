const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both username and password' });
        }

        // Query the unify_maskpro users table and join HR data
        const query = `
            SELECT u.*, h.base_hourly_rate, d.name as department_name, des.name as designation_name
            FROM users u
            LEFT JOIN hr_employees h ON u.id = h.user_id
            LEFT JOIN hr_departments d ON h.department_id = d.id
            LEFT JOIN hr_designations des ON h.designation_id = des.id
            WHERE u.username = ?
        `;
        const [rows] = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Check if user is active
        if (user.is_active === 0) {
            return res.status(401).json({ success: false, message: 'Your account has been deactivated. Please contact your administrator.' });
        }

        // Convert PHP's $2y$ hash prefix to $2a$ for Node.js bcrypt compatibility
        const nodeCompatibleHash = user.password.replace(/^\$2y\$/, '$2a$');
        
        // Verify password
        const isMatch = await bcrypt.compare(password, nodeCompatibleHash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT Token
        // Token contains subset of user info
        const payload = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            access_level: user.access_level,
            branch_id: user.branch_id,
            department_name: user.department_name,
            designation_name: user.designation_name,
            unify_job_title: user.job_title
        };

        const secret = process.env.JWT_SECRET || 'maskpro_hris_secret_key';
        const token = jwt.sign(payload, secret, { expiresIn: '24h' }); // 24-hour expiration

        // Send response
        res.json({
            success: true,
            token,
            user: payload
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

const { authorize } = require('../middleware/auth');

// POST /api/auth/impersonate
router.post('/impersonate', authorize(['admin']), async (req, res) => {
    try {
        const { target_user_id } = req.body;
        const impersonator = req.user; // The admin doing the impersonation

        if (!target_user_id) {
            return res.status(400).json({ success: false, message: 'Missing target_user_id' });
        }

        // Fetch target user details
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND is_active = 1', [target_user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found or inactive' });
        }

        const user = rows[0];

        // Generate a new JWT token for the target user, but attach an impersonator flag
        const payload = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            access_level: user.access_level,
            branch_id: user.branch_id,
            impersonator: {
                id: impersonator.id,
                username: impersonator.username,
                full_name: impersonator.full_name
            }
        };

        const secret = process.env.JWT_SECRET || 'maskpro_hris_secret_key';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Shorter expiry for impersonation

        res.json({
            success: true,
            token,
            user: payload
        });

    } catch (error) {
        console.error('Impersonation error:', error);
        res.status(500).json({ success: false, message: 'Server error during impersonation' });
    }
});

module.exports = router;
