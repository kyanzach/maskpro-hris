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

        // Query the unify_maskpro users table
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Check if user is active
        if (user.is_active === 0) {
            return res.status(401).json({ success: false, message: 'Your account has been deactivated. Please contact your administrator.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

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
            branch_id: user.branch_id
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

module.exports = router;
