import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import JobDesk from './pages/JobDesk';
import { AllEmployees, Designations, EmploymentStatus, Departments, Holiday, Announcements, Assets } from './pages/EmployeePages';
import { LeaveStatus, LeaveRequest, LeaveCalendar, LeaveSummary } from './pages/LeavePages';
import { AttendanceDailyLog, WorkShifts, RateMatrix, ImagePayslips } from './pages/PlaceholderPages';
import { AttendanceDetails, AttendanceRequest, Payrun, Payslip, Beneficiary, AccountingBatch, UsersRoles, OrgStructure, BiometricManager, UnifySync, AppSettings, LeaveSettings, AttendanceSettings, PayrollSettings, Import } from './pages/AdminPages';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="job-desk" element={<JobDesk />} />
              
              {/* Employee */}
              <Route path="employees" element={<AllEmployees />} />
              <Route path="designations" element={<Designations />} />
              <Route path="employment-status" element={<EmploymentStatus />} />

              {/* Leave */}
              <Route path="leaves/status" element={<LeaveStatus />} />
              <Route path="leaves/request" element={<LeaveRequest />} />
              <Route path="leaves/calendar" element={<LeaveCalendar />} />
              <Route path="leaves/summary" element={<LeaveSummary />} />

              {/* Attendance */}
              <Route path="attendance/daily-log" element={<AttendanceDailyLog />} />
              <Route path="attendance/details" element={<AttendanceDetails />} />
              <Route path="attendance/request" element={<AttendanceRequest />} />

              {/* Payroll */}
              <Route path="payroll/payrun" element={<Payrun />} />
              <Route path="payroll/payslip" element={<Payslip />} />
              <Route path="payroll/beneficiary" element={<Beneficiary />} />
              <Route path="payroll/rate-matrix" element={<RateMatrix />} />
              <Route path="payroll/accounting-batch" element={<AccountingBatch />} />

              {/* Admin */}
              <Route path="admin/roles" element={<UsersRoles />} />
              <Route path="admin/shifts" element={<WorkShifts />} />
              <Route path="admin/departments" element={<Departments />} />
              <Route path="admin/holidays" element={<Holiday />} />
              <Route path="admin/org-structure" element={<OrgStructure />} />
              <Route path="admin/announcements" element={<Announcements />} />
              <Route path="admin/biometrics" element={<BiometricManager />} />
              <Route path="admin/unify-sync" element={<UnifySync />} />

              {/* Assets */}
              <Route path="assets" element={<Assets />} />

              {/* Settings */}
              <Route path="settings/app" element={<AppSettings />} />
              <Route path="settings/leave" element={<LeaveSettings />} />
              <Route path="settings/attendance" element={<AttendanceSettings />} />
              <Route path="settings/payroll" element={<PayrollSettings />} />
              <Route path="settings/import" element={<Import />} />
              <Route path="settings/payslips" element={<ImagePayslips />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
