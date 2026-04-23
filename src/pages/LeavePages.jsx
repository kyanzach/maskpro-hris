import React, { useState, useEffect } from 'react';
import { Plus, CalendarDays, CheckCircle, XCircle, Clock } from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const btn = { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(99,102,241,0.3)', fontFamily: 'inherit' };
const card = { background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', overflow: 'hidden' };
const th = { padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' };
const td = { padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.06)', fontSize: '14px' };

export const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/leaves', { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json()).then(d => { setLeaves(d.data || []); setLoading(false); });
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Leave Status</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Overview of all filed and approved leaves</p></div>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Employee</th><th style={th}>Leave Type</th><th style={th}>Dates</th><th style={th}>Reason</th><th style={th}>Status</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '3rem' }}>Loading leaves...</td></tr> :
              leaves.length === 0 ? <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No leave requests filed yet.</td></tr> :
              leaves.map(l => (
                <tr key={l.id}>
                  <td style={{ ...td, fontWeight: '500' }}>{l.full_name}</td>
                  <td style={td}><span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '99px', fontSize: '13px' }}>{l.type}</span></td>
                  <td style={{ ...td, color: '#64748b', fontSize: '13px' }}>{new Date(l.start_date).toLocaleDateString()} – {new Date(l.end_date).toLocaleDateString()}</td>
                  <td style={{ ...td, color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason || '—'}</td>
                  <td style={td}><span className={`badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>{l.status}</span></td>
                  <td style={td}>{l.status === 'Pending' && <div style={{ display: 'flex', gap: '8px' }}><button style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Approve</button><button style={{ background: '#f43f5e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Reject</button></div>}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LeaveRequest = () => (
  <div style={{ padding: '2rem' }}>
    <div style={{ marginBottom: '2rem' }}><h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>File Leave Request</h1><p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Submit a new leave application</p></div>
    <div style={{ ...card, padding: '32px', maxWidth: '650px' }}>
      <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Leave Type</label>
        <select style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit', background: '#f8fafc', color: '#1e293b', fontWeight: '500', outline: 'none', transition: 'border-color 0.2s' }}>
          <option>Vacation Leave</option><option>Sick Leave</option><option>Unpaid Leave</option><option>Maternity Leave</option><option>Paternity Leave</option>
        </select>
      </div>
      
      {/* Modern Flatpickr Range Picker (matches unify bookings style) */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Date Range</label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '14px', left: '16px', color: '#64748b', zIndex: 2, pointerEvents: 'none' }}>
            <CalendarDays size={18} />
          </div>
          <Flatpickr
            options={{
              mode: 'range',
              dateFormat: 'M j, Y',
              minDate: 'today',
            }}
            placeholder="Select a date range..."
            style={{ 
              width: '100%', padding: '14px 16px 14px 44px', border: '2px solid #e2e8f0', 
              borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit', color: '#1e293b', 
              fontWeight: '500', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Reason</label>
        <textarea rows="3" style={{ width: '100%', padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', fontFamily: 'inherit', background: '#f8fafc', resize: 'vertical', color: '#1e293b', outline: 'none' }} placeholder="Briefly describe why you need leave..." /></div>
      <button style={{ ...btn, width: '100%', padding: '16px', fontSize: '16px' }}>Submit Request</button>
    </div>
  </div>
);

export const LeaveCalendar = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Leave Calendar</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ textAlign: 'center', padding: '12px', fontWeight: '600', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>{d}</div>)}
          {days.map((day, i) => <div key={i} style={{ textAlign: 'center', padding: '16px 8px', borderRadius: '12px', background: day === now.getDate() ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : day ? '#f8fafc' : 'transparent', color: day === now.getDate() ? 'white' : day ? '#1e293b' : 'transparent', fontWeight: day === now.getDate() ? '700' : '400', fontSize: '14px', cursor: day ? 'pointer' : 'default', transition: 'background 0.2s' }}>{day || ''}</div>)}
        </div>
      </div>
    </div>
  );
};

export const LeaveSummary = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>Leave Summary</h1>
    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Annual leave balance overview</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {[{ label: 'Vacation', total: 15, used: 3, color: '#6366f1' }, { label: 'Sick', total: 10, used: 1, color: '#f59e0b' }, { label: 'Unpaid', total: '∞', used: 0, color: '#64748b' }].map(t => (
        <div key={t.label} style={{ ...card, padding: '24px', borderTop: `3px solid ${t.color}` }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 8px 0' }}>{t.label} Leave</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800' }}>{t.used}</span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>/ {t.total}</span>
          </div>
          <div style={{ marginTop: '12px', height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '3px', background: t.color, width: typeof t.total === 'number' ? `${(t.used/t.total)*100}%` : '0%' }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
