import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, MoreHorizontal, CheckCircle, XCircle, Building2 } from 'lucide-react';

const btn = { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' };
const card = { background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', overflow: 'hidden' };
const th = { padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' };
const td = { padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.06)', fontSize: '14px' };

export const AllEmployees = () => {
  const { user, impersonate } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [formData, setFormData] = useState({
    department_id: '', designation_id: '', employment_status_id: '', shift_id: '', base_hourly_rate: 0, overtime_rate: 0, biometric_uid: ''
  });

  // Reference data for dropdowns
  const [depts, setDepts] = useState([]);
  const [desigs, setDesigs] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [shifts, setShifts] = useState([]);

  const loadData = () => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` };
    Promise.all([
      fetch('/api/employees', { headers }).then(r => r.json()),
      fetch('/api/departments', { headers }).then(r => r.json()),
      fetch('/api/designations', { headers }).then(r => r.json()),
      fetch('/api/employment-statuses', { headers }).then(r => r.json()),
      fetch('/api/shifts', { headers }).then(r => r.json())
    ]).then(([empRes, deptRes, desigRes, statusRes, shiftRes]) => {
      setEmployees(empRes.data || []);
      setDepts(deptRes.data || []);
      setDesigs(desigRes.data || []);
      setStatuses(statusRes.data || []);
      setShifts(shiftRes.data || []);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({
      department_id: emp.department_id || '',
      designation_id: emp.designation_id || '',
      employment_status_id: emp.employment_status_id || '',
      shift_id: emp.shift_id || '',
      base_hourly_rate: emp.base_hourly_rate || 0,
      overtime_rate: emp.overtime_rate || 0,
      biometric_uid: emp.biometric_uid || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/employees/${editingEmp.user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    loadData();
  };

  const filtered = employees.filter(e => e.full_name?.toLowerCase().includes(search.toLowerCase()) || e.username?.toLowerCase().includes(search.toLowerCase()));
  const isSuperAdmin = ['ryan','karen'].includes(user?.username);

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
            <th style={th}>Employee</th><th style={th}>Username</th><th style={th}>Role</th><th style={th}>Department</th><th style={th}>Shift</th>
            {isSuperAdmin && <th style={th}>Rate</th>}
            <th style={th}>Action</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={isSuperAdmin ? 7 : 6} style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
              filtered.length === 0 ? <tr><td colSpan={isSuperAdmin ? 7 : 6} style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No employees found.</td></tr> :
              filtered.map(emp => (
                <tr key={emp.user_id} style={{ transition: 'background 0.2s' }}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>{emp.full_name?.charAt(0) || 'U'}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{emp.full_name || emp.username}</div>
                        {emp.biometric_uid && <div style={{ fontSize: '11px', color: '#64748b' }}>Bio ID: {emp.biometric_uid}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ ...td, color: '#64748b' }}>@{emp.username}</td>
                  <td style={td}>
                    <div style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '99px', fontSize: '12px', display: 'inline-block' }}>{emp.designation_name || emp.unify_job_title || emp.access_level}</div>
                    {emp.employment_status && <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>{emp.employment_status}</div>}
                  </td>
                  <td style={{ ...td, color: '#64748b' }}>{emp.department_name || '—'}</td>
                  <td style={{ ...td, color: '#64748b' }}>{emp.shift_name ? `${emp.shift_name} (${emp.start_time}-${emp.end_time})` : '—'}</td>
                  {isSuperAdmin && (
                    <td style={td}>
                      <span style={{ fontWeight: '600' }}>₱{emp.base_hourly_rate || '0.00'}/hr</span>
                    </td>
                  )}
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(emp)} style={{ background: '#f8fafc', color: '#3b82f6', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>
                        HR Profile
                      </button>
                      {isSuperAdmin && emp.username !== user?.username && (
                        <button onClick={() => {
                          if (window.confirm(`Login as ${emp.full_name}?`)) {
                            impersonate(emp.user_id).then(res => {
                              if (res.success) window.location.reload();
                              else alert(res.message);
                            });
                          }
                        }} style={{ background: '#f8fafc', color: '#6366f1', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>
                          Login As
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '600px', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>Edit HR Profile: {editingEmp?.full_name}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Department</label>
                  <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                    <option value="">-- Select --</option>
                    {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Designation</label>
                  <select value={formData.designation_id} onChange={e => setFormData({...formData, designation_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                    <option value="">-- Select --</option>
                    {desigs.filter(d => !formData.department_id || d.department_id == formData.department_id).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Employment Status</label>
                  <select value={formData.employment_status_id} onChange={e => setFormData({...formData, employment_status_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                    <option value="">-- Select --</option>
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Work Shift</label>
                  <select value={formData.shift_id} onChange={e => setFormData({...formData, shift_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                    <option value="">-- Select --</option>
                    {shifts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.start_time}-{s.end_time})</option>)}
                  </select>
                </div>
              </div>

              {isSuperAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#10b981' }}>Base Hourly Rate (₱)</label>
                    <input type="number" step="0.01" value={formData.base_hourly_rate} onChange={e => setFormData({...formData, base_hourly_rate: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#10b981' }}>Overtime Rate (₱/hr)</label>
                    <input type="number" step="0.01" value={formData.overtime_rate} onChange={e => setFormData({...formData, overtime_rate: parseFloat(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Biometric Device UID</label>
                <input type="text" placeholder="e.g. 104" value={formData.biometric_uid} onChange={e => setFormData({...formData, biometric_uid: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Matches the exact ID on the Cordya Fingerprint device.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={btn}>Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const Designations = () => {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', department_id: '' });

  const loadData = () => {
    setLoading(true);
    fetch('/api/designations', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  };

  useEffect(() => { 
    loadData(); 
    fetch('/api/departments', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => setDepartments(d.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/designations/${editing.id}` : '/api/designations';
    
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
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Designations</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Job titles and role definitions</p></div>
        <button style={btn} onClick={() => { setEditing(null); setFormData({ name: '', description: '', department_id: '' }); setModalOpen(true); }}><Plus size={16} /> Add Designation</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No designations yet. Create your first one.</p> :
          data.map(d => (
            <div key={d.id} style={{ ...card, padding: '24px', cursor: 'pointer' }} onClick={() => { setEditing(d); setFormData({ name: d.name, description: d.description, department_id: d.department_id || '' }); setModalOpen(true); }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600' }}>{d.name}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Dept: {d.department_name || 'Unassigned'}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{d.description || 'No description'}</p>
            </div>
          ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '500px', background: 'white' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>{editing ? 'Edit Designation' : 'Add Designation'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Designation Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Department</label>
                <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                  <option value="">-- No Department --</option>
                  {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={btn}>{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const EmploymentStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', color_code: '#6366f1' });

  const loadData = () => {
    setLoading(true);
    fetch('/api/employment-statuses', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/employment-statuses/${editing.id}` : '/api/employment-statuses';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` },
      body: JSON.stringify(formData)
    });
    setModalOpen(false);
    loadData();
  };

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Employment Status</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Regular, Probationary, Student, etc.</p></div>
        <button style={btn} onClick={() => { setEditing(null); setFormData({ name: '', color_code: '#6366f1' }); setModalOpen(true); }}><Plus size={16} /> Add Status</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No statuses configured yet.</p> :
          data.map((s, i) => {
            const displayColor = s.color_code || colors[i % colors.length];
            return (
              <div key={s.id} style={{ ...card, padding: '24px', borderLeft: `4px solid ${displayColor}`, cursor: 'pointer' }} onClick={() => { setEditing(s); setFormData({ name: s.name, color_code: s.color_code || '#6366f1' }); setModalOpen(true); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: '600' }}>{s.name}</h3>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: displayColor }}>{s.employee_count}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>{s.employee_count} employee{s.employee_count !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '500px', background: 'white' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>{editing ? 'Edit Status' : 'Add Status'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Status Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Color Code</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {colors.map(c => (
                    <div key={c} onClick={() => setFormData({...formData, color_code: c})} style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, cursor: 'pointer', border: formData.color_code === c ? '3px solid #334155' : 'none' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={btn}>{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const Departments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadData = () => {
    setLoading(true);
    fetch('/api/departments', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/departments/${editing.id}` : '/api/departments';
    
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
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Departments</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage company branches and departments</p></div>
        <button style={btn} onClick={() => { setEditing(null); setFormData({ name: '', description: '' }); setModalOpen(true); }}><Plus size={16} /> Add Department</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {loading ? <p>Loading...</p> : data.length === 0 ? <p style={{ color: '#94a3b8' }}>No departments yet. Create Davao Obrero, Davao Ecoland, etc.</p> :
          data.map(d => (
            <div key={d.id} style={{ ...card, padding: '24px', cursor: 'pointer' }} onClick={() => { setEditing(d); setFormData({ name: d.name, description: d.description }); setModalOpen(true); }}>
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

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '500px', background: 'white' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>{editing ? 'Edit Department' : 'Add Department'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={btn}>{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const Holiday = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '', type: 'Regular' });

  const loadData = () => {
    setLoading(true);
    fetch('/api/holidays', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setData(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/holidays/${editing.id}` : '/api/holidays';
    
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
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Holidays</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Public and special non-working holidays</p></div>
        <button style={btn} onClick={() => { setEditing(null); setFormData({ name: '', start_date: '', end_date: '', type: 'Regular' }); setModalOpen(true); }}><Plus size={16} /> Add Holiday</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Holiday</th><th style={th}>Start Date</th><th style={th}>End Date</th><th style={th}>Type</th><th style={th}>Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading...</td></tr> :
              data.length === 0 ? <tr><td colSpan="5" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No holidays configured yet.</td></tr> :
              data.map(h => (
                <tr key={h.id}>
                  <td style={{ ...td, fontWeight: '600' }}>{h.name}</td>
                  <td style={td}>{new Date(h.start_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={td}>{h.end_date ? new Date(h.end_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                  <td style={td}><span className={h.type === 'Regular' ? 'badge badge-info' : 'badge badge-warning'}>{h.type}</span></td>
                  <td style={td}>
                    <button onClick={() => { 
                      setEditing(h); 
                      setFormData({ 
                        name: h.name, 
                        start_date: new Date(h.start_date).toISOString().split('T')[0], 
                        end_date: h.end_date ? new Date(h.end_date).toISOString().split('T')[0] : '', 
                        type: h.type 
                      }); 
                      setModalOpen(true); 
                    }} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...card, padding: '32px', width: '100%', maxWidth: '500px', background: 'white' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem' }}>{editing ? 'Edit Holiday' : 'Add Holiday'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Holiday Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Start Date</label>
                  <input required type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>End Date (Optional)</label>
                  <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none', background: 'white' }}>
                  <option value="Regular">Regular Holiday</option>
                  <option value="Special Non-Working">Special Non-Working Holiday</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={btn}>{editing ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const Announcements = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/announcements', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
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
    fetch('/api/assets', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
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
