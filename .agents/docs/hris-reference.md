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

## 🖥️ Production Server (DigitalOcean — Shared Droplet)

| Key | Value |
|-----|-------|
| **IP** | `167.71.217.49` |
| **Path** | `/var/www/hris/` (Pending Setup) |
| **DB** | `unify_maskpro` (Shared) |
| **Server** | Ubuntu 22.04 |

### Sister Apps on This Droplet — DO NOT TOUCH
| App | PM2 Process | Port | DB | Path |
|-----|-------------|------|----|------|
| Unify Vite | `unify-vite` | 3007 | `unify_maskpro` (**shared!**) | `/var/www/unify-vite/` |
| GetSales | `maskpro-api` | 3002 | `maskpro_commissions` | `/var/www/getsales/` |
| GetSales SSR | `getsales-public` | 3005 | (same) | `/var/www/getsales/public-web/` |
| GAQ | `gaq-api` | 3003 | `maskpro_quotations` | `/var/www/gaq/` |
| MaskPro Care | `maskpro-care` | 3004 | `unify_maskpro` (**shared!**) | `/var/www/care/` |

> ⚠️ **STRICT COMPLIANCE:** NEVER modify the PM2 processes, databases, or directory structures of the sister apps listed above. When executing PM2 restarts or managing ports, ensure you are strictly working within the bounds of the new `hris` port allocation.

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

### ⚠️ SSH & Deployment Warnings (CRITICAL)
- **ALL remote commands MUST use `sshpass`** — never use bare `ssh` or `rsync` as it causes interactive password prompts which will freeze deployment scripts.
- **SCP is Broken via `sshpass`**: Running `sshpass -e scp` fails with "Permission denied". 
  - **Workaround**: Pipe file content via SSH stdin instead: `SSHPASS="..." sshpass -e ssh root@167.71.217.49 "cat > /tmp/migration.sql" < local_file.sql`
- **Missing `sshpass` Locally**: If `sshpass` is not installed on the local runner, you MUST compile it from source before running any remote commands:
  ```bash
  mkdir -p /tmp/sshpass_build && cd /tmp/sshpass_build && curl -sSLk -O https://sourceforge.net/projects/sshpass/files/sshpass/1.10/sshpass-1.10.tar.gz && tar xzf sshpass-1.10.tar.gz && cd sshpass-1.10 && ./configure --prefix=/tmp/ssh && make && make install && export PATH="/tmp/ssh/bin:$PATH"
  ```

### ⏰ Strict Timezone Compliance
All server configurations, project files, application logic, and database connections MUST strictly adhere to **GMT+8 (Asia/Manila) Philippines Standard Time**.
- **Never default to UTC**.
- Force Node.js/PHP processes to strictly use `Asia/Manila`.
- Since biometric punches are extremely time-sensitive (Lates/Undertime calculation), timezone discrepancy will silently corrupt HR data.
