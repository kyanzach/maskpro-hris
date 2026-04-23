const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authorize } = require('../middleware/auth');
const { processDTR } = require('../cron/attendanceJob');

// @route   GET /api/attendance/daily
// @desc    Get daily attendance log
// @access  Private
router.get('/daily', authorize(), async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        
        const query = `
            SELECT 
                a.id,
                a.punch_date,
                a.in_time,
                a.break_out_time,
                a.break_in_time,
                a.out_time,
                a.status,
                a.late_minutes,
                a.total_work_hours,
                u.full_name,
                u.job_title
            FROM hr_attendance a
            INNER JOIN hr_employees h ON a.employee_id = h.id
            INNER JOIN users u ON h.user_id = u.id
            WHERE a.punch_date = ?
            ORDER BY a.in_time DESC
        `;
        
        const [logs] = await pool.query(query, [date]);
        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/attendance/punch
// @desc    Manual punch in/out (Web fallback)
// @access  Private
router.post('/punch', authorize(), async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        
        // Find hr_employee id
        const [emp] = await pool.query('SELECT id FROM hr_employees WHERE user_id = ?', [userId]);
        if (!emp.length) return res.status(404).json({ success: false, message: 'HR Profile not found' });
        
        const empId = emp[0].id;
        
        // Check if already punched in today
        const [existing] = await pool.query('SELECT * FROM hr_attendance WHERE employee_id = ? AND punch_date = ?', [empId, dateString]);
        
        if (existing.length === 0) {
            // Punch In
            await pool.query(
                'INSERT INTO hr_attendance (employee_id, punch_date, in_time, status, sync_source) VALUES (?, ?, ?, ?, ?)',
                [empId, dateString, now, 'Present', 'Manual']
            );
            res.json({ success: true, message: 'Punched In Successfully', type: 'in', time: now });
        } else {
            // Punch Out
            if (existing[0].out_time) {
                return res.status(400).json({ success: false, message: 'Already punched out today' });
            }
            
            const inTime = new Date(existing[0].in_time);
            const hours = (now - inTime) / (1000 * 60 * 60);
            
            await pool.query(
                'UPDATE hr_attendance SET out_time = ?, total_work_hours = ? WHERE id = ?',
                [now, hours.toFixed(2), existing[0].id]
            );
            res.json({ success: true, message: 'Punched Out Successfully', type: 'out', time: now });
        }
    } catch (error) {
        console.error('Punch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/attendance/sync
// @desc    Receive raw punch logs from biometric bridge
// @access  Private (API Key)
router.post('/sync', async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        // Using a simple API key check for the bridge
        if (!apiKey || apiKey !== process.env.HRIS_API_KEY) {
            return res.status(401).json({ success: false, message: 'Unauthorized API Key' });
        }

        const { logs } = req.body;
        if (!logs || !Array.isArray(logs)) {
            return res.status(400).json({ success: false, message: 'Invalid payload' });
        }

        let insertedCount = 0;
        let skippedCount = 0;

        for (const log of logs) {
            try {
                // Ensure timestamp is properly formatted for MySQL DATETIME
                const recordTime = new Date(log.timestamp).toISOString().slice(0, 19).replace('T', ' ');
                
                // Use INSERT IGNORE to gracefully skip duplicate punches
                const [result] = await pool.query(
                    'INSERT IGNORE INTO hr_biometric_logs (biometric_uid, record_time, punch_state) VALUES (?, ?, ?)',
                    [log.biometric_uid, recordTime, log.status || 1]
                );

                if (result.affectedRows > 0) {
                    insertedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error('Error inserting log:', err);
                // Continue with other logs
            }
        }

        res.json({ 
            success: true, 
            message: `Sync complete. Inserted: ${insertedCount}, Skipped/Duplicates: ${skippedCount}` 
        });
    } catch (error) {
        console.error('Biometric Sync Error:', error);
        res.status(500).json({ success: false, message: 'Server error during sync' });
    }
});

// @route   POST /api/attendance/process
// @desc    Manually trigger DTR logic processing
// @access  Private (Admin/HR)
router.post('/process', authorize(['admin', 'hr']), async (req, res) => {
    try {
        await processDTR();
        res.json({ success: true, message: 'DTR Processing completed successfully.' });
    } catch (error) {
        console.error('Manual Process Error:', error);
        res.status(500).json({ success: false, message: 'Server error during processing' });
    }
});

// @route   PUT /api/attendance/:id/override
// @desc    Manually override an attendance record (fix missing punch)
// @access  Private (Admin/HR)
router.put('/:id/override', authorize(['admin', 'hr']), async (req, res) => {
    try {
        const { id } = req.params;
        const { in_time, break_out_time, break_in_time, out_time, status, admin_notes } = req.body;

        // Fetch original to calculate new total_work_hours
        const [existing] = await pool.query('SELECT * FROM hr_attendance WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ success: false, message: 'Record not found' });

        // Calculate hours
        let totalHours = 0;
        const inDate = in_time ? new Date(in_time) : null;
        const boutDate = break_out_time ? new Date(break_out_time) : null;
        const binDate = break_in_time ? new Date(break_in_time) : null;
        const outDate = out_time ? new Date(out_time) : null;

        if (inDate && outDate) {
            if (boutDate && binDate) {
                totalHours = (((boutDate - inDate) + (outDate - binDate)) / (1000 * 60 * 60)).toFixed(2);
            } else {
                totalHours = ((outDate - inDate) / (1000 * 60 * 60)).toFixed(2);
            }
        }

        const query = `
            UPDATE hr_attendance 
            SET in_time = ?, break_out_time = ?, break_in_time = ?, out_time = ?, status = ?, total_work_hours = ?, sync_source = 'Manual', admin_notes = ?
            WHERE id = ?
        `;
        await pool.query(query, [
            in_time || null, break_out_time || null, break_in_time || null, out_time || null, 
            status, totalHours, admin_notes || null, id
        ]);

        res.json({ success: true, message: 'Attendance record manually updated' });
    } catch (error) {
        console.error('Override Error:', error);
        res.status(500).json({ success: false, message: 'Server error during override' });
    }
});

module.exports = router;
