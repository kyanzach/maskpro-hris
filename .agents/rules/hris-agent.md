---
trigger: always_on
glob: 
description: 
---
# MaskPro HRIS Agent Rules

> ⚠️ **CRITICAL: READ BEFORE ANY WORK**
> You are working on the MaskPro HRIS application, a brand new Vite/React SPA that integrates directly with the main `unify_maskpro` database.
> The backend will be a Node.js API (Express/NestJS) or PHP, sharing the DigitalOcean Droplet with the main Unify app.
> Do NOT create a separate database. Use the shared `unify_maskpro` database.

## Architecture
- **Frontend**: Vite + React
- **Backend API**: Node.js (or PHP, confirm architecture)
- **Database**: `unify_maskpro` (Shared with main Unify app)
- **Local Workspace**: `/Applications/XAMPP/xamppfiles/htdocs/hris.maskpro.ph/`
- **Production Server**: DigitalOcean Droplet (`167.71.217.49`)

## Biometric Integration (CORDYA / ZKTeco OEM)
- Fingerprint attendance devices (ZKTeco compatible) will be connected via RJ45 to a Mini-PC.
- We will utilize ZK Protocol libraries (e.g., `zkteco-js` or `node-zklib`) in a Node.js background service to poll/listen to the biometric device.
- The Node.js service will push raw attendance logs directly into the `unify_maskpro` database (`hr_attendance` table).

## Core Modules
1. **Dashboard**: Daily attendance overview, leave requests pending, upcoming holidays.
2. **Job Desk**: Employee profiles, roles, and shift assignments.
3. **Leave Management**: Leave requests (Vacation, Sick, etc.), approvals, balances.
4. **Attendance**: Raw biometric logs mapping, daily time records (DTR), late/undertime calculation.
5. **Holiday Management**: Public and custom holidays affecting attendance/payroll.

## Critical Rules
1. **Read `.agents/docs/hris-reference.md`** before any work. Record all new learnings there, NOT in this file.
2. Always read `CREDENTIALS_REFERENCE.md` (if available) for SSH, MySQL, API keys — never ask the user for credentials.
3. Always check `CHANGELOG.md` at session start for recall.
4. Log all new learnings in `.agents/docs/hris-reference.md` → Learnings Log.
5. **Shared Database Rule**: NEVER DROP or ALTER existing tables from the `unify_maskpro` schema unless strictly necessary for HRIS integration. Prefix new tables with `hr_` (e.g., `hr_employees`, `hr_attendance`, `hr_leaves`).
6. NEVER use native system dialogs (`alert()`, `confirm()`, `prompt()`) — use modern UI components.
7. MaskPro Care and Unify share `unify_maskpro` DB — only touch HRIS-owned tables, never Unify or Care's tables unexpectedly.
8. ALL SSH/rsync commands MUST use `sshpass` pattern: `SSHPASS="777Godisgood" sshpass -e ssh -o StrictHostKeyChecking=no root@167.71.217.49 "command"`.
9. NEVER use `rsync --delete` for deployment. Additive only.
10. **Legacy Reference ONLY**: We use the legacy application at `/Applications/XAMPP/xamppfiles/htdocs/payday.maskpro.ph` for studying data models, migrations, and underlying business logic. However, **DO NOT copy the code directly**. We are building a robust, high-performance Vite/React application. You must explicitly enhance the system architecture and provide a premium, modern 2026 UX/UI.

## Database Schema Constraints
- Ensure `user_id` mapping correctly links HRIS employees to `users` table from Unify if they have system access, or maintain a separate `hr_employees` table that optionally links to `users.id`.
- Timezone handling MUST be strict. The biometric device operates in Asia/Manila (UTC+8). Server DB is configured for UTC/Manila accordingly.

## Git & Versioning
- Check `CHANGELOG.md` at session start.
- Every functional code change MUST have a CHANGELOG entry before committing.
- Commit format: `feat/fix/chore: [title]` + multi-line description.
