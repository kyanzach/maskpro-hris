import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import JobDesk from './pages/JobDesk';
import * as Pages from './pages/PlaceholderPages';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="job-desk" element={<JobDesk />} />
              
              {/* Employee Routes */}
              <Route path="employees" element={<Pages.AllEmployees />} />
              <Route path="designations" element={<Pages.Designations />} />
              <Route path="employment-status" element={<Pages.EmploymentStatus />} />

              {/* Leave Routes */}
              <Route path="leaves/status" element={<Pages.LeaveStatus />} />
              <Route path="leaves/request" element={<Pages.LeaveRequest />} />
              <Route path="leaves/calendar" element={<Pages.LeaveCalendar />} />
              <Route path="leaves/summary" element={<Pages.LeaveSummary />} />

              {/* Attendance Routes */}
              <Route path="attendance/daily-log" element={<Pages.AttendanceDailyLog />} />
              <Route path="attendance/details" element={<Pages.AttendanceDetails />} />
              <Route path="attendance/request" element={<Pages.AttendanceRequest />} />

              {/* Payroll Routes */}
              <Route path="payroll/payrun" element={<Pages.Payrun />} />
              <Route path="payroll/payslip" element={<Pages.Payslip />} />
              <Route path="payroll/beneficiary" element={<Pages.Beneficiary />} />
              <Route path="payroll/rate-matrix" element={<Pages.RateMatrix />} />
              <Route path="payroll/accounting-batch" element={<Pages.AccountingBatch />} />

              {/* Admin Routes */}
              <Route path="admin/roles" element={<Pages.UsersRoles />} />
              <Route path="admin/shifts" element={<Pages.WorkShifts />} />
              <Route path="admin/departments" element={<Pages.Departments />} />
              <Route path="admin/holidays" element={<Pages.Holiday />} />
              <Route path="admin/org-structure" element={<Pages.OrgStructure />} />
              <Route path="admin/announcements" element={<Pages.Announcements />} />
              <Route path="admin/biometrics" element={<Pages.BiometricManager />} />
              <Route path="admin/unify-sync" element={<Pages.UnifySync />} />

              {/* Asset Route */}
              <Route path="assets" element={<Pages.Assets />} />

              {/* Settings Routes */}
              <Route path="settings/app" element={<Pages.AppSettings />} />
              <Route path="settings/leave" element={<Pages.LeaveSettings />} />
              <Route path="settings/attendance" element={<Pages.AttendanceSettings />} />
              <Route path="settings/payroll" element={<Pages.PayrollSettings />} />
              <Route path="settings/import" element={<Pages.Import />} />
              <Route path="settings/payslips" element={<Pages.ImagePayslips />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
