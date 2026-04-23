const cron = require('node-cron');
const pool = require('../config/db');

// Helper to calculate difference in minutes between two datetimes
const diffMinutes = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
};

// Helper to convert decimal hours
const diffHours = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return diff.toFixed(2);
};

const processDTR = async () => {
    console.log('[DTR Engine] Starting Daily Time Record processing...');
    
    try {
        // 1. Fetch unprocessed logs
        const [logs] = await pool.query(`
            SELECT id, biometric_uid, record_time 
            FROM hr_biometric_logs 
            WHERE is_processed = FALSE 
            ORDER BY biometric_uid, record_time ASC
        `);

        if (logs.length === 0) {
            console.log('[DTR Engine] No new biometric logs to process.');
            return;
        }

        // 2. Group by biometric_uid and DATE
        const grouped = {};
        logs.forEach(log => {
            // Using local time string to group by date
            const dateStr = new Date(log.record_time).toLocaleDateString('en-CA'); // YYYY-MM-DD
            const uid = log.biometric_uid;
            
            if (!grouped[uid]) grouped[uid] = {};
            if (!grouped[uid][dateStr]) grouped[uid][dateStr] = { logs: [], ids: [] };
            
            grouped[uid][dateStr].logs.push(new Date(log.record_time));
            grouped[uid][dateStr].ids.push(log.id);
        });

        // 3. Process each group
        for (const uid in grouped) {
            // Get Employee and Shift Info
            const [empRows] = await pool.query(`
                SELECT h.id as employee_id, s.start_time, s.end_time, s.late_grace_period_mins
                FROM hr_employees h
                LEFT JOIN hr_shifts s ON h.shift_id = s.id
                WHERE h.biometric_uid = ?
            `, [uid]);

            if (empRows.length === 0) {
                console.warn(`[DTR Engine] No employee mapped for biometric_uid: ${uid}`);
                continue;
            }

            const emp = empRows[0];

            for (const dateStr in grouped[uid]) {
                const rawPunches = grouped[uid][dateStr].logs;
                const logIds = grouped[uid][dateStr].ids;

                // Filter out accidental double-punches (within 5 minutes of each other)
                const validPunches = [];
                for (let i = 0; i < rawPunches.length; i++) {
                    if (i === 0) {
                        validPunches.push(rawPunches[i]);
                    } else {
                        if (diffMinutes(rawPunches[i], validPunches[validPunches.length - 1]) >= 5) {
                            validPunches.push(rawPunches[i]);
                        }
                    }
                }

                let inTime = null, breakOutTime = null, breakInTime = null, outTime = null;

                if (validPunches.length === 1) {
                    inTime = validPunches[0];
                } else if (validPunches.length === 2) {
                    inTime = validPunches[0];
                    outTime = validPunches[1];
                } else if (validPunches.length === 3) {
                    inTime = validPunches[0];
                    breakOutTime = validPunches[1];
                    outTime = validPunches[2];
                } else if (validPunches.length >= 4) {
                    inTime = validPunches[0];
                    breakOutTime = validPunches[1];
                    breakInTime = validPunches[2];
                    outTime = validPunches[validPunches.length - 1]; // Use last punch as out
                }

                // Calculate Late Minutes
                let lateMins = 0;
                let status = 'Present';

                if (inTime && emp.start_time) {
                    // Create Date objects for shift start relative to punch date
                    const shiftStartStr = `${dateStr}T${emp.start_time}`;
                    const shiftStart = new Date(shiftStartStr);
                    
                    const gracePeriod = emp.late_grace_period_mins || 0;
                    const shiftStartWithGrace = new Date(shiftStart.getTime() + gracePeriod * 60000);

                    if (inTime > shiftStartWithGrace) {
                        lateMins = diffMinutes(inTime, shiftStart);
                        status = 'Late';
                    }
                }

                // Calculate Total Work Hours
                let totalHours = 0;
                if (inTime && outTime) {
                    if (breakOutTime && breakInTime) {
                        // 4 punches (deduct lunch)
                        const morningHrs = diffHours(breakOutTime, inTime);
                        const afternoonHrs = diffHours(outTime, breakInTime);
                        totalHours = parseFloat(morningHrs) + parseFloat(afternoonHrs);
                    } else {
                        // 2 or 3 punches (no strict lunch bounds, just use In to Out)
                        // Note: Depending on company policy, HR might manually adjust this later if they didn't punch out for lunch
                        totalHours = parseFloat(diffHours(outTime, inTime));
                    }
                }

                // Insert or Update hr_attendance
                // Check if existing record for this date
                const [existing] = await pool.query(
                    'SELECT id FROM hr_attendance WHERE employee_id = ? AND punch_date = ?',
                    [emp.employee_id, dateStr]
                );

                // Format dates for MySQL
                const toMysql = (dt) => dt ? dt.toISOString().slice(0, 19).replace('T', ' ') : null;

                if (existing.length === 0) {
                    await pool.query(`
                        INSERT INTO hr_attendance 
                        (employee_id, punch_date, in_time, break_out_time, break_in_time, out_time, status, late_minutes, total_work_hours, sync_source)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Biometric')
                    `, [
                        emp.employee_id, dateStr, 
                        toMysql(inTime), toMysql(breakOutTime), toMysql(breakInTime), toMysql(outTime), 
                        status, lateMins, totalHours
                    ]);
                } else {
                    // We only overwrite if it's currently a Biometric sync. If it was Manual override, we might want to respect it, but for now we update.
                    await pool.query(`
                        UPDATE hr_attendance 
                        SET in_time = ?, break_out_time = ?, break_in_time = ?, out_time = ?, status = ?, late_minutes = ?, total_work_hours = ?, sync_source = 'Biometric'
                        WHERE id = ?
                    `, [
                        toMysql(inTime), toMysql(breakOutTime), toMysql(breakInTime), toMysql(outTime), 
                        status, lateMins, totalHours, existing[0].id
                    ]);
                }

                // Mark processed
                if (logIds.length > 0) {
                    await pool.query(
                        `UPDATE hr_biometric_logs SET is_processed = TRUE WHERE id IN (?)`,
                        [logIds]
                    );
                }
            }
        }

        console.log('[DTR Engine] Processing complete.');
    } catch (error) {
        console.error('[DTR Engine] Error during processing:', error);
    }
};

// Run cron job every day at 11:55 PM to process all remaining logs for the day
const startCron = () => {
    cron.schedule('55 23 * * *', () => {
        processDTR();
    }, {
        timezone: "Asia/Manila"
    });
    console.log('[DTR Engine] Cron job scheduled for 11:55 PM Asia/Manila daily.');
};

module.exports = {
    startCron,
    processDTR
};
