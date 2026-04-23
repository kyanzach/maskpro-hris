import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wifi, WifiOff, Server, RefreshCw, Users, Shield, Settings, FileUp, Download } from 'lucide-react';

const btn = { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' };
const card = { background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', overflow: 'hidden' };
const th = { padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' };
const td = { padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.06)', fontSize: '14px' };

export const AttendanceDetails = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/attendance/daily', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setLogs(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Attendance Details</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Detailed punch-by-punch attendance records</p>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Employee</th><th style={th}>Date</th><th style={th}>In Time</th><th style={th}>Out Time</th><th style={th}>Late (min)</th><th style={th}>Total Hrs</th><th style={th}>Status</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan="7" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
            logs.length === 0 ? <tr><td colSpan="7" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No attendance data available.</td></tr> :
            logs.map(l => (<tr key={l.id}><td style={{ ...td, fontWeight: '500' }}>{l.full_name}</td><td style={td}>{l.punch_date}</td><td style={td}>{l.in_time ? new Date(l.in_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : '—'}</td><td style={td}>{l.out_time ? new Date(l.out_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : '—'}</td><td style={td}>{l.late_minutes || 0}</td><td style={{ ...td, fontWeight: '600' }}>{l.total_work_hours || '—'}</td><td style={td}><span className={`badge ${l.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>{l.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

export const AttendanceRequest = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Attendance Request</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Submit manual DTR override requests</p>
    <div style={{ ...card, padding: '32px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Request Type</label>
        <select style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc' }}>
          <option>Missing Punch-In</option><option>Missing Punch-Out</option><option>Wrong Time Correction</option><option>Work From Home</option>
        </select></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Date</label>
          <input type="date" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc' }} /></div>
        <div><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Correct Time</label>
          <input type="time" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc' }} /></div>
      </div>
      <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Reason</label>
        <textarea rows="3" placeholder="Explain the correction needed..." style={{ width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc', resize: 'vertical' }} /></div>
      <button style={{ ...btn, width: '100%' }}>Submit Request</button>
    </div>
  </div>
);

export const Payrun = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Payrun</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Batch process payroll calculations</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {[{ label: 'Current Period', value: 'Apr 1-15, 2026', sub: 'Semi-Monthly', color: '#6366f1' }, { label: 'Est. Total Payroll', value: '₱ 245,000', sub: '23 employees', color: '#10b981' }, { label: 'Last Run', value: 'Mar 16-31', sub: 'Completed', color: '#f59e0b' }].map(c => (
        <div key={c.label} style={{ ...card, padding: '24px', borderLeft: `4px solid ${c.color}` }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 8px 0' }}>{c.label}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 4px 0' }}>{c.value}</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{c.sub}</p>
        </div>
      ))}
    </div>
    <button style={btn}>▶ Run Payroll</button>
  </div>
);

export const Payslip = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Payslips</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Generated payslips for completed payruns</p>
    <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
      <p style={{ fontSize: '3rem', marginBottom: '12px' }}>💰</p>
      <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>No Payslips Generated Yet</h3>
      <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>Run your first payroll cycle to generate downloadable payslips for all employees.</p>
    </div>
  </div>
);

export const Beneficiary = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Beneficiary & Deductions</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>SSS, PhilHealth, Pag-IBIG contribution tracking</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
      {[{ name: 'SSS', desc: 'Social Security System', icon: '🏛️', color: '#6366f1' }, { name: 'PhilHealth', desc: 'Philippine Health Insurance', icon: '🏥', color: '#10b981' }, { name: 'Pag-IBIG', desc: 'Home Development Mutual Fund', icon: '🏠', color: '#f59e0b' }].map(b => (
        <div key={b.name} style={{ ...card, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>{b.icon}</span>
            <div><h3 style={{ margin: 0, fontWeight: '600' }}>{b.name}</h3><p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{b.desc}</p></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(99,102,241,0.06)' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Employee Share</span><span style={{ fontWeight: '600' }}>Auto-computed</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(99,102,241,0.06)' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Employer Share</span><span style={{ fontWeight: '600' }}>Auto-computed</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AccountingBatch = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px 20px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Shield size={20} color="#92400e" /><span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>This view is privacy-restricted. Individual base rates are hidden from this role.</span>
    </div>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800', color: '#059669' }}>Blinded Accounting Batch</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Process disbursements without accessing individual pay rates</p>
    <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
      <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</p>
      <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>No Active Batch</h3>
      <p style={{ color: '#94a3b8' }}>Complete a payrun first to generate the accounting batch for disbursement.</p>
    </div>
  </div>
);

export const UsersRoles = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setEmployees(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Users & Roles</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Granular access control for HRIS modules</p>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>User</th><th style={th}>Unify Role</th><th style={th}>HRIS Access</th><th style={th}>Status</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan="4" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
            employees.map(e => (<tr key={e.user_id}><td style={{ ...td, fontWeight: '500' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>{e.full_name?.charAt(0)}</div>{e.full_name}</div></td><td style={td}><span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '99px', fontSize: '13px' }}>{e.access_level}</span></td><td style={td}>{e.access_level === 'admin' ? <span className="badge badge-info">Full Access</span> : <span className="badge badge-neutral">Standard</span>}</td><td style={td}>{e.is_active ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

export const OrgStructure = () => {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    fetch('/api/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => setEmployees(d.data || [])).catch(() => {});
  }, []);
  const depts = {};
  employees.forEach(e => { const d = e.department_name || 'Unassigned'; if (!depts[d]) depts[d] = []; depts[d].push(e); });
  const nodeStyle = (bg) => ({ padding: '12px 20px', background: bg, borderRadius: '14px', fontSize: '13px', fontWeight: '600', textAlign: 'center', minWidth: '140px' });
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Org. Structure</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Company hierarchy and reporting lines</p>
      <div style={{ ...card, padding: '48px', overflowX: 'auto' }}>
        <div style={{ textAlign: 'center', minWidth: '700px' }}>
          <div style={nodeStyle('linear-gradient(135deg, #6366f1, #4f46e5)')}>
            <span style={{ color: 'white' }}>Ryan & Karen Paco</span>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Owners / Admin</div>
          </div>
          <div style={{ width: '2px', height: '32px', background: '#e2e8f0', margin: '0 auto' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[{ name: 'Davao Obrero', color: '#10b981' }, { name: 'Gensan', color: '#f59e0b' }, { name: 'Davao Ecoland', color: '#06b6d4' }].map(b => (
              <div key={b.name} style={{ textAlign: 'center' }}>
                <div style={{ width: '2px', height: '24px', background: '#e2e8f0', margin: '0 auto' }} />
                <div style={{ ...nodeStyle(`${b.color}15`), border: `2px solid ${b.color}`, color: b.color }}>{b.name} Branch</div>
              </div>
            ))}
          </div>
          <div style={{ width: '2px', height: '32px', background: '#e2e8f0', margin: '16px auto 0' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '0' }}>
            {Object.entries(depts).map(([dept, members]) => (
              <div key={dept} style={{ ...nodeStyle('#f1f5f9'), border: '1px solid #e2e8f0', color: '#374151' }}>
                {dept} <span style={{ color: '#94a3b8', fontWeight: '400' }}>({members.length})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BiometricManager = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800', color: '#059669' }}>Biometric Manager</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Mini-PC ZKTeco device sync status</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}><div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WifiOff size={20} color="white" /></div><div><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Device Status</h3><p style={{ margin: 0, fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>Awaiting Setup</p></div></div>
        <p style={{ fontSize: '13px', color: '#64748b' }}>The Mini-PC daemon has not been configured yet. Connect the ZKTeco device via RJ45 to begin.</p>
      </div>
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}><div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={20} color="white" /></div><div><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Sync Queue</h3><p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>0 pending logs</p></div></div>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Offline buffer is empty. Logs will queue here when the Mini-PC cannot reach the server.</p>
      </div>
    </div>
  </div>
);

export const UnifySync = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800', color: '#059669' }}>Unify Sync Status</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Real-time bridge monitor between HRIS and Unify POS</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
      {[{ label: 'User Sync', status: 'Connected', icon: <Users size={20} color="white" />, color: '#10b981' }, { label: 'DB Connection', status: 'Shared (unify_maskpro)', icon: <Server size={20} color="white" />, color: '#6366f1' }, { label: 'Last Sync', status: 'Real-time', icon: <RefreshCw size={20} color="white" />, color: '#06b6d4' }].map(s => (
        <div key={s.label} style={{ ...card, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div><h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>{s.label}</h3><p style={{ margin: 0, fontSize: '13px', color: '#10b981', fontWeight: '500' }}>{s.status}</p></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const AppSettings = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>App Settings</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Core HRIS configuration</p>
    <div style={{ ...card, padding: '32px', maxWidth: '700px' }}>
      {[{ label: 'Company Name', value: 'MaskPro Philippines' }, { label: 'Timezone', value: 'Asia/Manila (GMT+8)' }, { label: 'Currency', value: 'PHP (₱)' }, { label: 'Date Format', value: 'MM/DD/YYYY' }].map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
          <span style={{ fontWeight: '500' }}>{s.label}</span>
          <span style={{ color: '#64748b' }}>{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const LeaveSettings = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Leave Settings</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Configure leave types, accruals, and carryover rules</p>
    <div style={{ ...card, padding: '32px', maxWidth: '700px' }}>
      {[{ label: 'Vacation Leave Days', value: '15 days/year' }, { label: 'Sick Leave Days', value: '10 days/year' }, { label: 'Allow Carryover', value: 'Yes (max 5 days)' }, { label: 'Min. Advance Notice', value: '3 days' }].map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
          <span style={{ fontWeight: '500' }}>{s.label}</span>
          <span style={{ color: '#64748b' }}>{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const AttendanceSettings = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Attendance Settings</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Grace periods, overtime rules, and thresholds</p>
    <div style={{ ...card, padding: '32px', maxWidth: '700px' }}>
      {[{ label: 'Grace Period', value: '15 minutes' }, { label: 'Overtime Threshold', value: 'After 8 hrs' }, { label: 'OT Multiplier (Regular)', value: '1.25x' }, { label: 'OT Multiplier (Holiday)', value: '2.0x' }, { label: 'Night Diff Start', value: '10:00 PM' }].map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
          <span style={{ fontWeight: '500' }}>{s.label}</span>
          <span style={{ color: '#64748b' }}>{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const PayrollSettings = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Payroll Settings</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Default payrun schedule and calculation rules</p>
    <div style={{ ...card, padding: '32px', maxWidth: '700px' }}>
      {[{ label: 'Pay Frequency', value: 'Semi-Monthly (1st & 16th)' }, { label: 'SSS Deduction', value: 'Automatic' }, { label: 'PhilHealth Deduction', value: 'Automatic' }, { label: 'Pag-IBIG Deduction', value: 'Automatic' }, { label: 'Tax Method', value: 'Withholding (BIR Table)' }].map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
          <span style={{ fontWeight: '500' }}>{s.label}</span>
          <span style={{ color: '#64748b' }}>{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const Import = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Import</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Bulk import employees, attendance, and payroll data</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {[{ title: 'Import Employees', desc: 'Bulk add staff via CSV', icon: <Users size={24} color="#6366f1" /> }, { title: 'Import Attendance', desc: 'Upload biometric logs from CSV', icon: <FileUp size={24} color="#10b981" /> }, { title: 'Download Template', desc: 'Get CSV template files', icon: <Download size={24} color="#f59e0b" /> }].map(i => (
        <div key={i.title} style={{ ...card, padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ marginBottom: '16px' }}>{i.icon}</div>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{i.title}</h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{i.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
