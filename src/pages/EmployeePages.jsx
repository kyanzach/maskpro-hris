import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, MoreHorizontal, CheckCircle, XCircle, Building2 } from 'lucide-react';

const btn = { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' };
const card = { background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', overflow: 'hidden' };
const th = { padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' };
const td = { padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.06)', fontSize: '14px' };

export const AllEmployees = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/employees', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setEmployees(d.data || []); setLoading(false); });
  }, []);

  const filtered = employees.filter(e => e.full_name?.toLowerCase().includes(search.toLowerCase()) || e.username?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>All Employees</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Complete staff directory across all branches</p>
        </div>
        <button style={btn}><Plus size={16} /> Add Employee</button>
      </div>
      <div style={card}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(99,102,241,0.06)', display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search by name or username..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc', outline: 'none' }} />
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={th}>Employee</th><th style={th}>Username</th><th style={th}>Role</th><th style={th}>Department</th><th style={th}>Status</th>
            {['ryan','karen'].includes(user?.username) && <th style={th}>Rate</th>}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
              filtered.length === 0 ? <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No employees found.</td></tr> :
              filtered.map(emp => (
                <tr key={emp.user_id} style={{ transition: 'background 0.2s' }}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>{emp.full_name?.charAt(0) || 'U'}</div>
                      <span style={{ fontWeight: '600' }}>{emp.full_name || emp.username}</span>
                    </div>
                  </td>
                  <td style={{ ...td, color: '#64748b' }}>@{emp.username}</td>
                  <td style={td}><span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '99px', fontSize: '13px' }}>{emp.unify_job_title || emp.access_level}</span></td>
                  <td style={{ ...td, color: '#64748b' }}>{emp.department_name || '—'}</td>
                  <td style={td}>{emp.is_active ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td>
                  {['ryan','karen'].includes(user?.username) && <td style={{ ...td, fontWeight: '600' }}>₱{emp.base_hourly_rate || '0.00'}/hr</td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Designations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/designations', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Designations</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Job titles and role definitions</p></div>
        <button style={btn}><Plus size={16} /> Add Designation</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No designations yet. Create your first one.</p> :
          data.map(d => (
            <div key={d.id} style={{ ...card, padding: '24px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600' }}>{d.name}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Dept: {d.department_name || 'Unassigned'}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{d.description || 'No description'}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export const EmploymentStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/employment-statuses', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Employment Status</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Regular, Probationary, Student, etc.</p></div>
        <button style={btn}><Plus size={16} /> Add Status</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No statuses configured yet.</p> :
          data.map((s, i) => (
            <div key={s.id} style={{ ...card, padding: '24px', borderLeft: `4px solid ${colors[i % colors.length]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: '600' }}>{s.name}</h3>
                <span style={{ fontSize: '20px', fontWeight: '800', color: colors[i % colors.length] }}>{s.employee_count}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>{s.employee_count} employee{s.employee_count !== 1 ? 's' : ''}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export const Departments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/departments', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Departments</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage company branches and departments</p></div>
        <button style={btn}><Plus size={16} /> Add Department</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No departments yet. Create HQ, Cebu Branch, etc.</p> :
          data.map(d => (
            <div key={d.id} style={{ ...card, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: '600' }}>{d.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{d.employee_count} members</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{d.description || 'No description provided'}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export const Holiday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/holidays', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Holidays</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Public and special non-working holidays</p></div>
        <button style={btn}><Plus size={16} /> Add Holiday</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Holiday</th><th style={th}>Start Date</th><th style={th}>End Date</th><th style={th}>Type</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="4" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
              data.length === 0 ? <tr><td colSpan="4" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No holidays configured yet.</td></tr> :
              data.map(h => (
                <tr key={h.id}>
                  <td style={{ ...td, fontWeight: '600' }}>{h.name}</td>
                  <td style={td}>{new Date(h.start_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={td}>{new Date(h.end_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={td}><span className={h.type === 'Regular' ? 'badge badge-info' : 'badge badge-warning'}>{h.type}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Announcements = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/announcements', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Announcements</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Company-wide broadcasts</p></div>
        <button style={btn}><Plus size={16} /> New Announcement</button>
      </div>
      {loading ? <p>Loading...</p> : data.length === 0 ? (
        <div style={{ ...card, padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📢</p>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>No Announcements</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Create your first company announcement to broadcast to all employees.</p>
        </div>
      ) : data.map(a => (
        <div key={a.id} style={{ ...card, padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{a.title}</h3>
          <p style={{ color: '#475569', fontSize: '14px', margin: '0 0 12px 0' }}>{a.body}</p>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>By {a.created_by_name} · {new Date(a.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export const Assets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/assets', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Company Assets</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Track laptops, equipment, and assigned property</p></div>
        <button style={btn}><Plus size={16} /> Add Asset</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Asset</th><th style={th}>Serial #</th><th style={th}>Type</th><th style={th}>Assigned To</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="4" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
              data.length === 0 ? <tr><td colSpan="4" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No assets registered yet.</td></tr> :
              data.map(a => (
                <tr key={a.id}>
                  <td style={{ ...td, fontWeight: '600' }}>{a.name}</td>
                  <td style={{ ...td, color: '#64748b', fontFamily: 'monospace' }}>{a.serial_number || '—'}</td>
                  <td style={td}><span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '99px', fontSize: '13px' }}>{a.type || 'General'}</span></td>
                  <td style={td}>{a.assigned_to_name || 'Unassigned'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
