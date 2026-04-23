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
