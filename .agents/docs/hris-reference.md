# HRIS App — Full Reference

> 📖 **This is the companion doc to `.agents/rules/hris-agent.md`.**
> The agent rules file points here for detailed schemas, learnings, and workflows.
> **Record all new learnings, phases, plans, and notes HERE** — not in the rules file.
> Also check `CHANGELOG.md` periodically for recent changes and recall.

---

## 🏗️ Architecture & Technology Stack
- **Frontend**: React + Vite (Single Page Application)
- **Backend**: Node.js Express API or PHP API (Shared Server)
- **Database**: `unify_maskpro` (Shared with main Unify app)
- **Legacy Reference**: The app feature set and structure draws heavily from the legacy `/Applications/XAMPP/xamppfiles/htdocs/payday.maskpro.ph` application. **Note: We treat this legacy app STRICTLY as a reference for database models, code logics, and features.** We DO NOT copy its exact code or UI. The new system must be heavily modernized, architecturally robust, and utilize state-of-the-art 2026 UX/UI standards.
- **Hardware Integration**: ZKTeco/Cordya Biometric Machine (Port 4370 UDP/TCP) connected via RJ45 to a network gateway or mini-PC.

---

## 🗂️ Core Navigation & Feature Modules

Based on the Payday layout and administrative requirements, the HRIS will feature the following core navigation structure:

1. **Dashboard**
   - High-level overviews (attendance today, pending leaves, upcoming holidays, active payruns).
2. **Job Desk**
   - Personal portal for employees (My profile, my attendance, my payslips).
3. **Employee**
   - Employee directory, onboarding, employment status tracking, and document/asset management.
4. **Leave**
   - Leave requests, Leave types config, Leave period setups, and balances.
5. **Attendance**
   - Daily Time Record (DTR), raw biometric logs mapping, break times, and summaries.
6. **Payroll**
   - Salary management, Beneficiaries (PhilHealth, SSS, Pag-IBIG), Payruns, and generated Payslips.
7. **Administration**
   - Users & Roles, Work Shifts, Departments, Holiday Management, Org. Structure, Announcements.
8. **Settings**
   - App settings, notification templates, and custom fields.

---

## 🗄️ Proposed Database Schema (Prefix `hr_`)

To prevent collisions with Unify while maintaining relationship integrity, all tables will be prefixed with `hr_`. They will mirror the robust relational structure of the legacy Laravel `payday` app.

### Administration & Structure
| Table | Notes |
|-------|-------|
| `hr_departments` | Org departments. |
| `hr_designations` | Job titles. |
| `hr_work_shifts` | Shift definitions (e.g., 8AM-5PM). |
| `hr_holidays` | System-wide holiday calendar. |
| `hr_announcements` | Global or department-specific broadcasts. |

### Employee Records
| Table | Notes |
|-------|-------|
| `hr_employees` | Core employee table (maps `unify_user_id` and `biometric_id`). |
| `hr_employment_statuses` | Regular, Probationary, Contractual. |
| `hr_company_assets` | Issued laptops, keys, etc. |

### Attendance & Leaves
| Table | Notes |
|-------|-------|
| `hr_attendance_logs` | Raw dumps from the Cordya machine. |
| `hr_attendances` | Processed Check-In/Check-Out with computed late/undertime minutes. |
| `hr_break_times` | Tracking standard breaks. |
| `hr_leaves` | Leave management (vacation, sick). |
| `hr_leave_types` | Definitions and annual allowances. |

### Payroll
| Table | Notes |
|-------|-------|
| `hr_salaries` | Base pay rates. |
| `hr_payruns` | Generated payroll batches. |
| `hr_payslips` | Individual generated slips. |
| `hr_beneficiaries` | Government/deduction entities. |

---

## 🎓 Learnings Log

> Before starting work, **read this section** to avoid repeating past mistakes.
> After completing work, **add new learnings** at the bottom.

### Architecture Decisions (Resolved 2026-04-23)
- **User Accounts**: HRIS users will use their existing Unify app credentials (same login). Mapping via `unify_user_id`.
- **Biometrics Push**: The Mini-PC will push biometric logs to the server in **real-time**.

### Biometric Machine Protocol
- The Cordya device acts as a ZKTeco OEM device. It uses the ZK Protocol.
- **Node.js Libraries**: `node-zklib` or `zkteco-js`.
- The mini-PC will act as a bridge. It will run a Node.js daemon that periodically (e.g., every 5 minutes) connects to the Cordya device IP over port 4370, downloads new attendance records (`getAttendances()`), clears them from the device if necessary, and pushes them to the HRIS API.
