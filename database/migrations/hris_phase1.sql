-- ==========================================
-- MaskPro HRIS - Phase 1 Migration
-- Description: Foundation & Employee Management
-- ==========================================

-- Safe Migration approach
-- 1. Departments
CREATE TABLE IF NOT EXISTS hr_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Designations
CREATE TABLE IF NOT EXISTS hr_designations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Employment Statuses
CREATE TABLE IF NOT EXISTS hr_employment_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure color_code exists
SET @dbname = 'unify_maskpro';
SET @tablename = 'hr_employment_statuses';
SET @columnname = 'color_code';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(20) DEFAULT '#6366f1';")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 4. Work Shifts
CREATE TABLE IF NOT EXISTS hr_work_shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    late_grace_period_mins INT DEFAULT 15,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Holidays
CREATE TABLE IF NOT EXISTS hr_holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    type ENUM('Regular', 'Special Non-Working', 'Company') DEFAULT 'Regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Announcements
CREATE TABLE IF NOT EXISTS hr_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Employees (Extension of Unify users table)
CREATE TABLE IF NOT EXISTS hr_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    biometric_uid INT NULL UNIQUE,
    department_id INT NULL,
    designation_id INT NULL,
    employment_status_id INT NULL,
    shift_id INT NULL,
    base_hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
    bonus_percentage DECIMAL(5, 2) DEFAULT 0.00,
    hire_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES hr_departments(id) ON DELETE SET NULL,
    FOREIGN KEY (designation_id) REFERENCES hr_designations(id) ON DELETE SET NULL,
    FOREIGN KEY (employment_status_id) REFERENCES hr_employment_statuses(id) ON DELETE SET NULL,
    FOREIGN KEY (shift_id) REFERENCES hr_work_shifts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
INSERT IGNORE INTO hr_departments (id, name, description) VALUES 
(1, 'Management', 'Executive and Top Management'),
(2, 'Sales', 'Sales and Marketing Team'),
(3, 'IT', 'Information Technology'),
(4, 'Accounting', 'Finance and Accounting'),
(5, 'Warehouse', 'Inventory and Logistics'),
(6, 'Technician', 'Service Installers and Detailers');

INSERT IGNORE INTO hr_designations (id, name) VALUES 
(1, 'Manager'),
(2, 'Supervisor'),
(3, 'Sales Advocate'),
(4, 'Admin Staff'),
(5, 'IT Head'),
(6, 'Technician'),
(7, 'Head Technician');

INSERT IGNORE INTO hr_employment_statuses (id, name, color_code) VALUES 
(1, 'Regular', '#10b981'),
(2, 'Probationary', '#f59e0b'),
(3, 'Contractual', '#3b82f6'),
(4, 'Student', '#8b5cf6');

INSERT IGNORE INTO hr_work_shifts (id, name, start_time, end_time, is_default) VALUES 
(1, 'Standard Day Shift', '09:00:00', '18:00:00', 1);
