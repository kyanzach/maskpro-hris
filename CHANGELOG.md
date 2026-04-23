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
