# MaskPro HRIS Implementation Plan

The objective is to create a new HRIS application using a Vite/React frontend and a Node.js backend. This system will integrate with the existing `unify_maskpro` database, and draw its feature set and structural logic from the legacy Laravel app at `payday.maskpro.ph`. **IMPORTANT: The legacy app is strictly a reference for business logic and data structure.** We must explicitly enhance the system rather than blindly copying it, ensuring it is highly robust and utilizes premium, state-of-the-art 2026 UX/UI patterns. A critical hardware requirement is integrating a Cordya (ZKTeco OEM) fingerprint biometric machine via RJ45 to track employee attendance automatically.

## User Review Required

> [!IMPORTANT]
> **Backend Architecture Decision Required**
> 
> For the backend API, we have two choices:
> 1. **Node.js (Express/NestJS)**: Excellent for the biometric machine integration (`node-zklib`) as it handles real-time sockets beautifully and pairs naturally with Vite/React.
> 2. **PHP 8.2 API (Laravel or Custom)**: Since the legacy `payday` app was built in Laravel, we could technically reuse parts of its backend, but integrating the biometric SDK in PHP is typically more complex (requiring polling crons rather than persistent listeners).
> 
> *Recommendation*: Since we need a background service on the Mini-PC for the biometrics, and a fresh Vite frontend, a unified **Node.js** backend is the most modern approach. Please confirm if we should proceed with Node.js.

> [!WARNING]
> **Biometric Mini-PC Network Setup**
> To communicate with the Cordya machine over RJ45:
> 1. The Mini-PC and the Cordya machine must be on the **same local network subnet** (e.g., Mini-PC at `192.168.1.100`, Cordya at `192.168.1.201`).
> 2. The Mini-PC must have internet access to push the logs to the DigitalOcean Droplet's API endpoint.
> Please ensure this hardware routing is established.

## Open Questions

1. ~~**User Accounts**: Should HRIS users (employees) log in using their existing Unify app credentials, or will HRIS have a completely separate authentication system?~~ **(Resolved: Yes, same login)**
2. ~~**Biometrics Push**: Do you want the Mini-PC to push biometric logs instantly (real-time) or periodically (e.g. every 15 minutes)?~~ **(Resolved: Yes, push real-time)**

## Proposed Changes & Feature Mapping

Based on the `payday` legacy app and your screenshot, the HRIS will feature the following modules:

### 1. Navigation & UI Structure
- **Dashboard**: High-level overviews (attendance today, pending leaves, upcoming holidays).
- **Job Desk**: Personal portal for an employee (My profile, my attendance, my payslips).
- **Employee**: Directory, onboarding, employment status.
- **Leave**: Requests, types, periods, and balances.
- **Attendance**: Daily Time Record (DTR), raw biometric logs mapping, and break times.
- **Payroll**: Salary configuration, beneficiaries, payruns, and payslips.
- **Administration**: Users & Roles, Work Shifts, Departments, Holiday, Org. Structure, Announcements.
- **Settings**: Global configuration.

### 2. Database Schema (Prefix `hr_`)
To ensure safety in the shared `unify_maskpro` database, all new tables will be prefixed with `hr_`. They are directly modeled after the Laravel `payday` migrations:
- `hr_departments`, `hr_designations`, `hr_work_shifts`, `hr_holidays`, `hr_announcements`
- `hr_employees`, `hr_employment_statuses`, `hr_company_assets`
- `hr_attendance_logs` (raw ZK dumps), `hr_attendances` (processed DTR), `hr_break_times`
- `hr_leaves`, `hr_leave_types`
- `hr_salaries`, `hr_payruns`, `hr_payslips`, `hr_beneficiaries`

### 3. Biometric Polling Service (Mini-PC Bridge)
- A standalone Node.js daemon using the `node-zklib` library.
- **Flow**: Connects to the device IP -> Downloads new attendances -> HTTP POSTs the data securely to the HRIS API -> HRIS API saves to `hr_attendance_logs`.

### 4. HRIS Backend Processing
- Hosted on the DigitalOcean Droplet (new PM2 process).
- An automated cron job will evaluate `hr_attendance_logs` against the `hr_work_shifts` rules to generate standard Check-In/Out entries in `hr_attendances`, calculating late and undertime minutes automatically.

## Verification Plan

### Automated Tests
- Test connection to the Cordya biometric device using a local Node.js test script to verify port `4370` accessibility.
- Validate that the `hr_` schema migrations execute cleanly on the Unify database.

### Manual Verification
1. Register a fingerprint on the Cordya device.
2. Execute a test punch.
3. Verify the Mini-PC daemon successfully extracts the punch and transmits it.
4. Check the Vite frontend "Attendance" module to see the raw log translated into a processed DTR entry based on the assigned Work Shift.
