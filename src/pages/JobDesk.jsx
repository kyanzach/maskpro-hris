import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Clock, Calendar, FileText, Download, Briefcase, Mail, Phone, MapPin, Award } from 'lucide-react';

const JobDesk = () => {
  const { user } = useContext(AuthContext);

  const cardStyle = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '20px',
    boxShadow: 'var(--glass-shadow)',
    padding: '24px',
    overflow: 'hidden'
  };

  const statCard = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const iconWrapper = (color, bg) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Profile Section */}
      <div style={{ ...cardStyle, marginBottom: '2rem', display: 'flex', gap: '24px', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.4) 100%)' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', color: 'white', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}>
          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{user?.full_name || 'User'}</h1>
            <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '99px', fontSize: '12px', fontWeight: '700' }}>ACTIVE</span>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#64748b', fontWeight: '500' }}>
            {user?.designation_name || user?.unify_job_title || user?.access_level || 'Employee'}
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
              <Briefcase size={16} color="#6366f1" /> {user?.department_name || 'Unassigned Department'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
              <MapPin size={16} color="#f43f5e" /> {user?.branch_id === 5 ? 'Davao Ecoland' : user?.branch_id === 2 ? 'Gensan' : 'Davao Obrero'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
              <Mail size={16} color="#10b981" /> {user?.username}@maskpro.ph
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Employee ID</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#334155', fontFamily: 'monospace' }}>MP-{String(user?.id).padStart(4, '0')}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Available Vacation Leave</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>12 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>Days</span></h2>
            </div>
            <div style={iconWrapper('#6366f1', '#e0e7ff')}><Calendar size={24} /></div>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: 'auto' }}>
            <div style={{ width: '80%', height: '100%', background: '#6366f1', borderRadius: '3px' }} />
          </div>
        </div>

        <div style={statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Available Sick Leave</p>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>5 <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>Days</span></h2>
            </div>
            <div style={iconWrapper('#f59e0b', '#fef3c7')}><FileText size={24} /></div>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: 'auto' }}>
            <div style={{ width: '50%', height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
          </div>
        </div>

        <div style={statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Next Payrun</p>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>April 30</h2>
            </div>
            <div style={iconWrapper('#10b981', '#d1fae5')}><Award size={24} /></div>
          </div>
          <p style={{ margin: 'auto 0 0 0', fontSize: '14px', color: '#64748b' }}>Period: Apr 16 - Apr 30</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Attendance */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recent Attendance</h3>
            <button style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#6366f1', cursor: 'pointer' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>Date</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>Time In</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>Time Out</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return (
                  <tr key={i}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f8fafc', fontWeight: '500', color: '#334155' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f8fafc', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#10b981" /> 08:55 AM</div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f8fafc', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#f43f5e" /> 06:05 PM</div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Present</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent Payslips */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Recent Payslips</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { period: 'Apr 01 - Apr 15, 2026', amount: '₱12,500.00' },
              { period: 'Mar 16 - Mar 31, 2026', amount: '₱12,500.00' },
              { period: 'Mar 01 - Mar 15, 2026', amount: '₱12,500.00' },
            ].map((slip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>{slip.period}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{slip.amount}</div>
                </div>
                <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDesk;
