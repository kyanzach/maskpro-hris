import React, { useState, useEffect } from 'react';

export const AllEmployees = () => <div className="p-8"><h1 className="text-2xl font-bold">All Employees</h1><p>Master employee directory.</p></div>;
export const Designations = () => <div className="p-8"><h1 className="text-2xl font-bold">Designations</h1><p>Manage job titles and roles.</p></div>;
export const EmploymentStatus = () => <div className="p-8"><h1 className="text-2xl font-bold">Employment Status</h1><p>Manage Regular, Probationary, Student tags.</p></div>;

export const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaves', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json())
      .then(d => { setLeaves(d.data || []); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>Leave Status</h1>
      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem' }}>Employee</th>
              <th style={{ padding: '1rem' }}>Leave Type</th>
              <th style={{ padding: '1rem' }}>Dates</th>
              <th style={{ padding: '1rem' }}>Reason</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading leaves...</td></tr> :
              leaves.map(leave => (
                <tr key={leave.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{leave.full_name}</td>
                  <td style={{ padding: '1rem' }}>{leave.type}</td>
                  <td style={{ padding: '1rem' }}>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{leave.reason}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', background: leave.status === 'Approved' ? '#d1fae5' : leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: leave.status === 'Approved' ? '#065f46' : leave.status === 'Rejected' ? '#991b1b' : '#92400e', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {leave.status}
                    </span>
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
export const LeaveRequest = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Requests</h1><p>Approve or reject filed leaves.</p></div>;
export const LeaveCalendar = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Calendar</h1><p>Visual calendar of who is away.</p></div>;
export const LeaveSummary = () => <div className="p-8"><h1 className="text-2xl font-bold">Leave Summary</h1><p>Annual leave reports.</p></div>;



export const Payrun = () => <div className="p-8"><h1 className="text-2xl font-bold">Payrun</h1><p>Batch process payroll calculations.</p></div>;
export const Payslip = () => <div className="p-8"><h1 className="text-2xl font-bold">Payslips</h1><p>View generated payslips.</p></div>;
export const Beneficiary = () => <div className="p-8"><h1 className="text-2xl font-bold">Beneficiary</h1><p>Manage SSS, PhilHealth, Pag-IBIG.</p></div>;

export const RateMatrix = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
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
export const WorkShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', start_time: '', end_time: '', late_grace_period_mins: 15, is_default: false });

  const loadData = () => {
    setLoading(true);
    fetch('/api/shifts', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json())
      .then(d => { setShifts(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/shifts/${editing.id}` : '/api/shifts';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    loadData();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Work Shifts</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>Configure operating hours and shift templates</p>
        </div>
        <button onClick={() => { setEditing(null); setFormData({ name: '', start_time: '', end_time: '', late_grace_period_mins: 15, is_default: false }); setModalOpen(true); }} style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' }}>Add Shift</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? <p>Loading shifts...</p> : shifts.map(shift => (
          <div key={shift.id} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => { setEditing(shift); setFormData({ name: shift.name, start_time: shift.start_time, end_time: shift.end_time, late_grace_period_mins: shift.late_grace_period_mins, is_default: !!shift.is_default }); setModalOpen(true); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>{shift.name}</h3>
              {shift.is_default ? <span style={{ background: '#d1fae5', color: '#065f46', padding: '0.125rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>Default</span> : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>☀️ {shift.start_time}</span>
              <span>—</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🌙 {shift.end_time}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Grace Period: {shift.late_grace_period_mins} mins</div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>{editing ? 'Edit Shift' : 'Add Shift'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Shift Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Start Time</label>
                  <input required type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>End Time</label>
                  <input required type="time" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Late Grace Period (Minutes)</label>
                <input required type="number" min="0" value={formData.late_grace_period_mins} onChange={e => setFormData({...formData, late_grace_period_mins: parseInt(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="is_default" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} />
                <label htmlFor="is_default" style={{ fontSize: '13px', fontWeight: '600' }}>Set as Default Shift</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export const Departments = () => <div className="p-8"><h1 className="text-2xl font-bold">Departments</h1><p>Davao Obrero, Davao Ecoland, etc.</p></div>;
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
export const ImagePayslips = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>Image Payslip Designer</h1>
    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Generate mobile-optimized, high-resolution PNG payslips for staff.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: '600' }}>Configuration</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Background Theme</label>
          <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
            <option>Dark Elegance (MaskPro Standard)</option>
            <option>Light Corporate</option>
          </select>
        </div>
        <button style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' }}>Generate Sample</button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1e293b', borderRadius: '8px', padding: '2rem', minHeight: '400px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', width: '320px', padding: '2rem', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#10b981', margin: '0 auto 0.5rem auto', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>M</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem' }}>MaskPro HRIS</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Payslip • Oct 1-15, 2026</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Employee</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Juan Dela Cruz</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Basic Pay</span>
            <span>₱ 8,500.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Bonus</span>
            <span style={{ color: '#10b981' }}>+ ₱ 1,200.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155', fontWeight: 'bold', fontSize: '1.125rem' }}>
            <span>Net Pay</span>
            <span style={{ color: '#10b981' }}>₱ 9,700.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
