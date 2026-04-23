import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Clock, 
  Banknote, 
  Settings,
  ShieldAlert,
  LogOut,
  Bell
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Job Desk', path: '/job-desk', icon: <Users size={20} /> },
    { name: 'Leaves', path: '/leaves', icon: <CalendarDays size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={20} /> },
    { name: 'Payroll', path: '/payroll', icon: <Banknote size={20} /> },
    { name: 'Administration', path: '/admin', icon: <ShieldAlert size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>M</span>
          </div>
          MaskPro HRIS
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--sidebar-active)' }}>
          <div className="nav-item cursor-pointer" style={{ color: '#ef4444', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header glass">
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>HRIS Portal</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--color-text-muted)" />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.65rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.full_name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.access_level || 'Staff'}</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
