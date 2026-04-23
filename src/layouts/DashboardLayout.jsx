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
  Bell,
  ChevronDown,
  ChevronRight,
  Package
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [expandedMenus, setExpandedMenus] = React.useState({});

  const toggleMenu = (name) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Job Desk', path: '/job-desk', icon: <Users size={20} /> },
    { 
      name: 'Employee', 
      icon: <Users size={20} />,
      subItems: [
        { name: 'All Employees', path: '/employees' },
        { name: 'Designation', path: '/designations' },
        { name: 'Employment Status', path: '/employment-status' }
      ]
    },
    { 
      name: 'Leave', 
      icon: <CalendarDays size={20} />,
      subItems: [
        { name: 'Leave Status', path: '/leaves/status' },
        { name: 'Leave Request', path: '/leaves/request' },
        { name: 'Calendar', path: '/leaves/calendar' },
        { name: 'Summary', path: '/leaves/summary' }
      ]
    },
    { 
      name: 'Attendance', 
      icon: <Clock size={20} />,
      subItems: [
        { name: 'Daily Log', path: '/attendance/daily-log' },
        { name: 'Attendance Details', path: '/attendance/details' },
        { name: 'Attendance Request', path: '/attendance/request' }
      ]
    },
    { 
      name: 'Payroll', 
      icon: <Banknote size={20} />,
      subItems: [
        { name: 'Payrun', path: '/payroll/payrun' },
        { name: 'Payslip', path: '/payroll/payslip' },
        { name: 'Beneficiary', path: '/payroll/beneficiary' },
        { name: 'Advanced Rate Matrix', path: '/payroll/rate-matrix', enhanced: true },
        { name: 'Accounting Batch', path: '/payroll/accounting-batch', enhanced: true }
      ]
    },
    { 
      name: 'Administration', 
      icon: <ShieldAlert size={20} />,
      subItems: [
        { name: 'Users & Roles', path: '/admin/roles' },
        { name: 'Work Shifts', path: '/admin/shifts' },
        { name: 'Departments', path: '/admin/departments' },
        { name: 'Holiday', path: '/admin/holidays' },
        { name: 'Org. Structure', path: '/admin/org-structure' },
        { name: 'Announcements', path: '/admin/announcements' },
        { name: 'Biometric Manager', path: '/admin/biometrics', enhanced: true },
        { name: 'Unify Sync Status', path: '/admin/unify-sync', enhanced: true }
      ]
    },
    { name: 'Assets', path: '/assets', icon: <Package size={20} /> },
    { 
      name: 'Settings', 
      icon: <Settings size={20} />,
      subItems: [
        { name: 'App Settings', path: '/settings/app' },
        { name: 'Leave Settings', path: '/settings/leave' },
        { name: 'Attendance Settings', path: '/settings/attendance' },
        { name: 'Payroll Settings', path: '/settings/payroll' },
        { name: 'Import', path: '/settings/import' },
        { name: 'Image Payslips', path: '/settings/payslips', enhanced: true }
      ]
    },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar" style={{ overflowY: 'auto' }}>
        <div className="sidebar-header">
          <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>M</span>
          </div>
          MaskPro HRIS
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <div 
                    className="nav-item cursor-pointer" 
                    onClick={() => toggleMenu(item.name)}
                    style={{ justifyContent: 'space-between', paddingRight: '1rem', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {expandedMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  {expandedMenus[item.name] && (
                    <div className="sub-menu" style={{ marginLeft: '2.5rem', marginTop: '0.25rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {item.subItems.map(sub => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          style={({ isActive }) => ({
                            fontSize: '0.875rem',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          })}
                        >
                          {sub.enhanced && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} title="MaskPro Enhanced Feature"></span>}
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--sidebar-active)', marginTop: 'auto' }}>
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
