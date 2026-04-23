const pool = require('./config/db');

async function migrate() {
    try {
        await pool.query('ALTER TABLE hr_employees CHANGE bonus_percentage overtime_rate DECIMAL(10,2) DEFAULT 0.00');
        console.log("Migration successful.");
    } catch (e) {
        console.error("Migration failed:", e.message);
    }
    process.exit(0);
}

migrate();
