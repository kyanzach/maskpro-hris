import React, { useState, useEffect } from 'react';

export const AllEmployees = () => <div className="p-8"><h1 className="text-2xl font-bold">All Employees</h1><p>Master employee directory.</p></div>;
export const Designations = () => <div className="p-8"><h1 className="text-2xl font-bold">Designations</h1><p>Manage job titles and roles.</p></div>;
export const EmploymentStatus = () => <div className="p-8"><h1 className="text-2xl font-bold">Employment Status</h1><p>Manage Regular, Probationary, Student tags.</p></div>;

export const LeaveStatus = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Status</h1><p>Overview of leave balances.</p></div>;
export const LeaveRequest = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Requests</h1><p>Approve or reject filed leaves.</p></div>;
export const LeaveCalendar = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Calendar</h1><p>Visual calendar of who is away.</p></div>;
export const LeaveSummary = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Summary</h1><p>Annual leave reports.</p></div>;

export const AttendanceDailyLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/attendance/daily', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json())
      .then(d => { setLogs(d.data || []); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>Daily Attendance Log</h1>
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Employee</th>
              <th style={{ padding: '1rem' }}>Punch In</th>
              <th style={{ padding: '1rem' }}>Punch Out</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr> :
              logs.length === 0 ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No attendance records for today.</td></tr> :
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{log.full_name}</td>
                  <td style={{ padding: '1rem' }}>{log.in_time ? new Date(log.in_time).toLocaleTimeString() : '--'}</td>
                  <td style={{ padding: '1rem' }}>{log.out_time ? new Date(log.out_time).toLocaleTimeString() : '--'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: log.status === 'Present' ? '#d1fae5' : '#fee2e2', color: log.status === 'Present' ? '#065f46' : '#991b1b', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{log.total_work_hours} hrs</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AttendanceDetails = () => <div className="p-8"><h1 className="text-2xl font-bold">Attendance Details</h1><p>Deep-dive into punch timestamps.</p></div>;
export const AttendanceRequest = () => <div className="p-8"><h1 className="text-2xl font-bold">Attendance Requests</h1><p>Manual DTR overrides.</p></div>;

export const Payrun = () => <div className="p-8"><h1 className="text-2xl font-bold">Payrun</h1><p>Batch process payroll calculations.</p></div>;
export const Payslip = () => <div className="p-8"><h1 className="text-2xl font-bold">Payslips</h1><p>View generated payslips.</p></div>;
export const Beneficiary = () => <div className="p-8"><h1 className="text-2xl font-bold">Beneficiary</h1><p>Manage SSS, PhilHealth, Pag-IBIG.</p></div>;

export const RateMatrix = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json())
      .then(d => { setEmployees(d.data || []); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.25rem' }}>Advanced Rate Matrix</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Configure strict MaskPro compensation rules. Hidden from standard accounting roles.</p>
      
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Employee</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Base Hourly Rate (₱)</th>
              <th style={{ padding: '1rem' }}>Bonus Percentage (%)</th>
              <th style={{ padding: '1rem' }}>Daily Hour Cap</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading Rate Matrix...</td></tr> :
              employees.map(emp => (
                <tr key={emp.user_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{emp.full_name}</td>
                  <td style={{ padding: '1rem' }}>{emp.employment_status || 'Unassigned'}</td>
                  <td style={{ padding: '1rem' }}>
                    <input type="number" defaultValue={emp.base_hourly_rate} style={{ width: '100px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <input type="number" defaultValue={emp.bonus_percentage} style={{ width: '100px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {emp.employment_status === 'Student' ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>4 Hours (Strict)</span> : <span>Standard (8 hrs)</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AccountingBatch = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-600">Blinded Accounting Batch</h1><p>Strictly blinded view for Accounting to disburse funds.</p></div>;

export const UsersRoles = () => <div className="p-8"><h1 className="text-2xl font-bold">Users & Roles</h1><p>Granular access control.</p></div>;
export const WorkShifts = () => <div className="p-8"><h1 className="text-2xl font-bold">Work Shifts</h1><p>Configure schedules like 8AM-5PM.</p></div>;
export const Departments = () => <div className="p-8"><h1 className="text-2xl font-bold">Departments</h1><p>HQ, Cebu, CDO, etc.</p></div>;
export const Holiday = () => <div className="p-8"><h1 className="text-2xl font-bold">Holidays</h1><p>Public and special holidays.</p></div>;
export const OrgStructure = () => <div className="p-8"><h1 className="text-2xl font-bold">Org. Structure</h1><p>Hierarchy tree chart.</p></div>;
export const Announcements = () => <div className="p-8"><h1 className="text-2xl font-bold">Announcements</h1><p>Company broadcasts.</p></div>;
export const BiometricManager = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-600">Biometric Manager</h1><p>Mini-PC ZKTeco offline sync status.</p></div>;
export const UnifySync = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-600">Unify Sync Status</h1><p>Real-time booking bridge monitor.</p></div>;

export const Assets = () => <div className="p-8"><h1 className="text-2xl font-bold">Assets</h1><p>Manage company property.</p></div>;

export const AppSettings = () => <div className="p-8"><h1 className="text-2xl font-bold">App Settings</h1><p>Core configuration.</p></div>;
export const LeaveSettings = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Settings</h1><p>Configure leave accruals.</p></div>;
export const AttendanceSettings = () => <div className="p-8"><h1 className="text-2xl font-bold">Attendance Settings</h1><p>Configure grace periods.</p></div>;
export const PayrollSettings = () => <div className="p-8"><h1 className="text-2xl font-bold">Payroll Settings</h1><p>Default payruns.</p></div>;
export const Import = () => <div className="p-8"><h1 className="text-2xl font-bold">Import</h1><p>CSV bulk import tools.</p></div>;
export const ImagePayslips = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-600">Image Payslip Designer</h1><p>Customize the mobile PNG payslip layout.</p></div>;
