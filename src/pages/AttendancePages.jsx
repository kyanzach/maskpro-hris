import React, { useState, useEffect } from 'react';
import { Calendar, Search, Edit2, Play, CheckCircle } from 'lucide-react';

export const AttendanceDailyLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Override Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    in_time: '', break_out_time: '', break_in_time: '', out_time: '', status: 'Present', admin_notes: ''
  });

  const loadData = () => {
    setLoading(true);
    fetch(`/api/attendance/daily?date=${date}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }})
      .then(r => r.json())
      .then(d => { setLogs(d.data || []); setLoading(false); });
  };

  useEffect(() => { loadData(); }, [date]);

  const handleProcessDTR = async () => {
    setProcessing(true);
    try {
      await fetch('/api/attendance/process', { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` }
      });
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const openOverrideModal = (log) => {
    setEditing(log);
    
    // Helper to format datetime to standard datetime-local input string YYYY-MM-DDTHH:MM
    const formatDT = (dtString) => {
        if (!dtString) return '';
        const d = new Date(dtString);
        // Correct for local timezone
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0,16);
    };

    setFormData({
      in_time: formatDT(log.in_time),
      break_out_time: formatDT(log.break_out_time),
      break_in_time: formatDT(log.break_in_time),
      out_time: formatDT(log.out_time),
      status: log.status || 'Present',
      admin_notes: log.admin_notes || ''
    });
    setModalOpen(true);
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    try {
        await fetch(`/api/attendance/${editing.id}/override`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('hris_token')}` },
            body: JSON.stringify({
                in_time: formData.in_time ? new Date(formData.in_time).toISOString() : null,
                break_out_time: formData.break_out_time ? new Date(formData.break_out_time).toISOString() : null,
                break_in_time: formData.break_in_time ? new Date(formData.break_in_time).toISOString() : null,
                out_time: formData.out_time ? new Date(formData.out_time).toISOString() : null,
                status: formData.status,
                admin_notes: formData.admin_notes
            })
        });
        setModalOpen(false);
        loadData();
    } catch (err) {
        console.error('Failed to override', err);
    }
  };

  const formatTime = (timeString) => {
      if (!timeString) return <span style={{ color: '#cbd5e1' }}>--:--</span>;
      return new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>Daily Time Records</h1>
          <p style={{ color: '#64748b', margin: 0 }}>View and manage employee daily attendance logs.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', gap: '12px' }}>
                <Calendar size={18} color="#64748b" />
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    style={{ border: 'none', outline: 'none', color: '#1e293b', fontWeight: '500', fontSize: '14px', background: 'transparent' }} 
                />
            </div>
            
            <button 
                onClick={handleProcessDTR}
                disabled={processing}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: processing ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)', 
                    color: 'white', border: 'none', padding: '10px 20px', 
                    borderRadius: '12px', fontWeight: '600', cursor: processing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s'
                }}
            >
                <Play size={16} /> {processing ? 'Processing...' : 'Run DTR Engine'}
            </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Employee</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>In Time</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Break Out</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Break In</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Out Time</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Total Hours</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px', color: '#64748b', fontWeight: '600', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading records...</td></tr> :
              logs.length === 0 ? <tr><td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No DTR processed for this date.</td></tr> :
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                  <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{log.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{log.job_title}</div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{formatTime(log.in_time)}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{formatTime(log.break_out_time)}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{formatTime(log.break_in_time)}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{formatTime(log.out_time)}</td>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#6366f1' }}>{log.total_work_hours} <span style={{ fontSize: '11px', fontWeight: '500', color: '#94a3b8' }}>hrs</span></td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                        padding: '4px 10px', 
                        background: log.status === 'Present' ? '#ecfdf5' : log.status === 'Late' ? '#fef2f2' : '#fef3c7', 
                        color: log.status === 'Present' ? '#059669' : log.status === 'Late' ? '#dc2626' : '#d97706', 
                        borderRadius: '99px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      {log.status === 'Present' && <CheckCircle size={12} />}
                      {log.status} {log.late_minutes > 0 ? `(${log.late_minutes}m)` : ''}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button onClick={() => openOverrideModal(log)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#94a3b8', transition: 'all 0.2s' }} title="Manual Override">
                          <Edit2 size={16} />
                      </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modalOpen && editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800' }}>Manual DTR Override</h2>
            <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Editing attendance for <strong>{editing.full_name}</strong> on {new Date(editing.punch_date).toLocaleDateString()}</p>
            
            <form onSubmit={handleOverrideSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>In Time</label>
                  <input type="datetime-local" value={formData.in_time} onChange={e => setFormData({...formData, in_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Break Out Time</label>
                  <input type="datetime-local" value={formData.break_out_time} onChange={e => setFormData({...formData, break_out_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Break In Time</label>
                  <input type="datetime-local" value={formData.break_in_time} onChange={e => setFormData({...formData, break_in_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Out Time</label>
                  <input type="datetime-local" value={formData.out_time} onChange={e => setFormData({...formData, out_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Admin Notes (Reason for override)</label>
                  <textarea rows="2" value={formData.admin_notes} onChange={e => setFormData({...formData, admin_notes: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none' }} placeholder="e.g. Employee forgot to punch out after shift"></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>Save Override</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AttendanceDetails = () => <div className="p-8"><h1 className="text-2xl font-bold">Attendance Details</h1><p>Deep-dive into punch timestamps.</p></div>;
export const AttendanceRequest = () => <div className="p-8"><h1 className="text-2xl font-bold">Attendance Requests</h1><p>Manual DTR overrides requested by employees.</p></div>;
