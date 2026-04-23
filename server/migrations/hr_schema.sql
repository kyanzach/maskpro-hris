-- Phase 1 HR Schema for unify_maskpro

-- 1. Departments & Designations
CREATE TABLE IF NOT EXISTS hr_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hr_designations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES hr_departments(id) ON DELETE CASCADE
);

-- 2. Employment Statuses (Regular, Part-Time Student, Summer Job, etc)
CREATE TABLE IF NOT EXISTS hr_employment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color_class VARCHAR(50) DEFAULT 'bg-primary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Working Shifts
CREATE TABLE IF NOT EXISTS hr_shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. HR Employees (Extending unify_maskpro.users)
CREATE TABLE IF NOT EXISTS hr_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NULL,
    designation_id INT NULL,
    employment_status_id INT NULL,
    shift_id INT NULL,
    biometric_uid VARCHAR(100) NULL UNIQUE,
    base_hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    bonus_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES hr_departments(id) ON DELETE SET NULL,
    FOREIGN KEY (designation_id) REFERENCES hr_designations(id) ON DELETE SET NULL,
    FOREIGN KEY (employment_status_id) REFERENCES hr_employment_statuses(id) ON DELETE SET NULL,
    FOREIGN KEY (shift_id) REFERENCES hr_shifts(id) ON DELETE SET NULL
);

-- 5. Attendance / Daily Time Record (DTR)
CREATE TABLE IF NOT EXISTS hr_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    punch_date DATE NOT NULL,
    in_time DATETIME NULL,
    out_time DATETIME NULL,
    status ENUM('Present', 'Absent', 'On Leave', 'Late', 'Half Day') DEFAULT 'Absent',
    late_minutes INT DEFAULT 0,
    undertime_minutes INT DEFAULT 0,
    total_work_hours DECIMAL(5,2) DEFAULT 0.00,
    sync_source ENUM('Manual', 'Biometric') DEFAULT 'Biometric',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES hr_employees(id) ON DELETE CASCADE,
    UNIQUE KEY (employee_id, punch_date)
);

-- 6. Raw Biometric Logs (Offline Sync Cache Table)
CREATE TABLE IF NOT EXISTS hr_biometric_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    biometric_uid VARCHAR(100) NOT NULL,
    punch_time DATETIME NOT NULL,
    state INT DEFAULT 0, -- ZKTeco state (0: In, 1: Out, etc)
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Holidays
CREATE TABLE IF NOT EXISTS hr_holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type ENUM('Regular', 'Special Non-Working') DEFAULT 'Regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
