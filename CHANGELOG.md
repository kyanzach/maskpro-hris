## [v1.6.0] — 2026-04-24
### Added / Changed / Fixed
- **Feature (Daily Time Record):** Implemented the backend DTR processing engine. It automatically maps raw biometric logs into a 4-punch structure (In Time, Break Out, Break In, Out Time) to calculate late minutes and total work hours accurately against the employee's assigned Work Shift.
- **Feature (Cron Job):** The DTR processing engine runs automatically as a background job every day at 11:55 PM (Asia/Manila time).
- **Feature (Attendance Log UI):** Built a robust Daily Attendance Log in the HRIS admin panel. It features a modern data table, visual status badges, and a date picker to fetch historical DTR records.
- **Feature (Manual Override):** Added a Manual Override modal for HR Admins to correct missing punches, assign "Half Day" or "Absent" statuses, and leave audit notes.
- **Database:** Added `break_out_time` and `break_in_time` columns to the `hr_attendance` table to accurately track lunch breaks.

## [v1.5.0] — 2026-04-24
### Added / Changed / Fixed
- **Feature (Mini-PC Kiosk):** Completely refactored the Biometric Bridge to run a local Express & WebSocket server. It now serves a beautiful, full-screen glass-morphism Kiosk UI that reacts in real-time to fingerprint punches, displaying the user's name, profile picture, and a randomized motivational Bible verse.
- **Feature (HRIS Profile):** Added a new `Profile Settings` page in the HRIS where employees can upload their profile pictures. 
- **API:** Added `POST /api/employees/profile-picture` using `multer` for secure image uploads.
- **API:** Added `GET /api/employees/biometric/:uid` for the Kiosk App to instantly fetch employee details upon a punch.
- **Handoff:** Created `setup_windows.bat` in the bridge folder to automatically install PM2, register the background service, and create a Windows Startup shortcut for the Kiosk mode Chrome browser.

## [v1.4.0] — 2026-04-24
### Added / Changed / Fixed
- **API:** Created the `POST /api/attendance/sync` receiver route to catch raw punches from the biometric bridge on the Mini-PC.
- **Database:** Added `hr_biometric_logs` table to safely store immutable, raw biometric punches using `INSERT IGNORE` to prevent duplicate timestamps.
- **Docs:** Generated a comprehensive `project_roadmap.md` mapping out the transition from Foundation (Phase 1) to Live Attendance Processing (Phase 2).

## [v1.3.6] — 2026-04-24
### Added / Changed / Fixed
- **Fix:** Fixed an issue where editing a `WorkShift` silently failed and reverted state due to a missing `PUT /api/shifts/:id` route in the backend API.
- **Logic:** Fixed the `POST /api/shifts` backend route which previously ignored the `late_grace_period_mins` payload.

## [v1.3.5] — 2026-04-23
### Added / Changed / Fixed
- **UI/UX:** Changed 'Bonus Percentage (%)' to 'Overtime Rate (₱/hr)' across the backend database and UI for correct phrasing.
- **Fix:** Fixed an issue where the `AllEmployees` edit modal did not prefetch or recall the current HR profile due to missing IDs in the API response.

## [v1.3.4] — 2026-04-23
### Added / Changed / Fixed
- **UI/UX:** Fully implemented interactive Add/Edit UI Modals for the `Departments`, `Designations`, `EmploymentStatus`, and `WorkShifts` components.
- **UI/UX:** Added interactive Add/Edit Modals for `Holiday` management.
- **Logic:** Updated `AllEmployees` component to include an "HR Profile" edit button that allows admin/hr to link Unify users with specific departments, designations, shifts, and biometric UIDs.
- **Logic:** Fixed the `GET /api/designations` route to properly join the `hr_departments` table so department names map correctly in the frontend.

## [v1.3.3] — 2026-04-23
### Added / Changed / Fixed
- **Security:** Implemented comprehensive Role-Based Access Control (RBAC) in the frontend navigation to hide sensitive settings, admin panels, and payroll configurations from standard employees based on their Unify `access_level`.

## [v1.3.2] — 2026-04-23
- **UI/UX:** Replaced the custom native dual-input date picker in Leave Request with `react-flatpickr` to perfectly match the unified, premium "flight schedule" styling used in the legacy `bookings.php` module.
- **Docs:** Added explicit instruction in `.agents/docs/hris-reference.md` to use Flatpickr instead of native inputs for all future date range selectors.

## [v1.3.1] — 2026-04-23
- **UI/UX:** Redesigned the Org Structure page into an interactive, animated custom tree structure.
- **UI/UX:** Fixed the squished HRIS logo in the Dashboard layout.
- **Logic:** Filtered out the Gensan branch (`branch_id = 2`) globally from the API so franchise staff do not appear in HRIS.
- **Logic:** Implemented branch filtering on the new Org Structure page (defaults to Davao Obrero).
- **Fix:** Corrected branch mapping IDs in the Job Desk UI to match the Unify database.

## [v1.3.0] — 2026-04-23
### Added / Changed / Fixed
- Seeded production database with functional departments and correctly mapped 23 employees
- Fixed API queries to filter out inactive users from HRIS views
- Added Admin Impersonation feature ("Login As") with "Go Back" functionality
- Modernized Leave Request date picker to a continuous "flight/hotel" style UI
- Fixed Org Structure to display real operational branches

## [v1.2.0] — 2026-04-23
### Added
- Built all 30+ HRIS pages with premium glassmorphism UI matching MaskPro Care design
- Created 7 backend API routes: departments, designations, holidays, dashboard stats, employment statuses, announcements, assets
- All Employee pages: directory with live Unify data, designations grid, employment status cards
- Leave module: status table with approve/reject, file request form, visual calendar, summary with balance bars
- Attendance module: daily log with punch data, detailed records, DTR override request form
- Payroll module: payrun dashboard, payslip viewer, SSS/PhilHealth/Pag-IBIG beneficiary cards, rate matrix, blinded accounting batch
- Administration: users & roles table, work shifts cards, departments grid, holidays table, org structure chart, announcements feed, biometric manager, Unify sync status
- Settings: app config, leave rules, attendance thresholds, payroll defaults, CSV import tools, image payslip designer
- Assets management page with serial number tracking

### Changed
- Complete CSS overhaul: premium glassmorphism design system (gradient cards, blur effects, smooth animations)
- Replaced all hardcoded IPs with relative API paths
- Login page: frosted glass MaskPro logo, clean form layout, gradient accent bar
- Sidebar: actual MaskPro logo, indigo/cyan color scheme, expanding sub-menus
- Fixed all dark-border-on-dark-button styling issues across the app

## [v1.1.0] — 2026-04-23
### Added
- Implemented robust JWT Authentication Flow utilizing the shared Unify `users` database
- Created secure `/api/auth/login` Node.js route with bcrypt password verification
- Built AuthContext for React state management and JWT interceptor mapping
- Developed a modern, standalone Login Page UI (Vanilla CSS)
- Enforced route protection ensuring unauthenticated users are redirected from the Dashboard

## [v1.0.1] — 2026-04-23
### Fixed
- Enforced strict GMT+8 (Asia/Manila) timezone compliance in Node.js environment and MySQL connection pool

## [v1.0.0] — 2026-04-23
### Added
- Initialized Vite + React frontend for HRIS application
- Created Node.js + Express backend skeleton for HRIS API
- Added modern UI design system (Vanilla CSS) and Dashboard layout
- Configured React Router for core navigation modules
