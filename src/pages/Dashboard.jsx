import React from 'react';
import { Users, Clock, CalendarX, Fingerprint } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, Admin!</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Here's what's happening today in MaskPro HRIS.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Stat Cards */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Employees</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>142</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Present Today</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>128</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarX size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>On Leave</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>5</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fingerprint size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Late Punches</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>9</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Attendance Logs</h3>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Employee</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Time</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>Juan Dela Cruz</td>
                  <td style={{ padding: '1rem' }}>07:45 AM</td>
                  <td style={{ padding: '1rem' }}>Check In</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-secondary)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' }}>On Time</span></td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem' }}>Maria Clara</td>
                  <td style={{ padding: '1rem' }}>08:15 AM</td>
                  <td style={{ padding: '1rem' }}>Check In</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' }}>Late</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Pending Leaves</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Pedro Penduko</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Sick Leave (2 days)</div>
              </div>
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Review</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '500' }}>Andres Bonifacio</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Vacation (5 days)</div>
              </div>
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
