import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, UserCheck, Clock, CalendarDays, AlertCircle, CalendarHeart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hris_token');
    fetch('/api/dashboard/stats', { headers: { 'Authorization': `Bearer ${token}` }})
      .then(r => r.json())
      .then(d => { setStats(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Employees', value: stats.total_employees, icon: <Users size={24} />, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Active Employees', value: stats.active_employees, icon: <UserCheck size={24} />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Present Today', value: stats.present_today, icon: <Clock size={24} />, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'On Leave', value: stats.on_leave, icon: <CalendarDays size={24} />, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Pending Leaves', value: stats.pending_leaves, icon: <AlertCircle size={24} />, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Upcoming Holidays', value: stats.upcoming_holidays, icon: <CalendarHeart size={24} />, color: '#ec4899', bg: '#fdf2f8' },
  ] : [];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'} 👋</h1>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>Here's what's happening with your team today.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Loading dashboard...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {statCards.map(card => (
              <div key={card.label} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Recent Attendance */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontWeight: '600' }}>Today's Attendance</h3>
              {stats?.recent_attendance?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.recent_attendance.map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          {a.full_name?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{a.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {a.in_time ? new Date(a.in_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </div>
                        </div>
                      </div>
                      <span style={{ padding: '0.125rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '500', background: a.status === 'Present' ? '#d1fae5' : '#fee2e2', color: a.status === 'Present' ? '#065f46' : '#991b1b' }}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No attendance records yet today.</p>
              )}
            </div>

            {/* Recent Leaves */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontWeight: '600' }}>Recent Leave Requests</h3>
              {stats?.recent_leaves?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.recent_leaves.map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{l.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{l.type} Leave</div>
                      </div>
                      <span style={{ padding: '0.125rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '500', background: l.status === 'Approved' ? '#d1fae5' : l.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: l.status === 'Approved' ? '#065f46' : l.status === 'Rejected' ? '#991b1b' : '#92400e' }}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>No leave requests yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
