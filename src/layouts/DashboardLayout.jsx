import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, CalendarDays, Clock, Banknote, Settings,
  ShieldAlert, LogOut, Bell, ChevronDown, ChevronRight, Package
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, revertImpersonation } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleMenu = (name) => setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Job Desk', path: '/job-desk', icon: <Users size={20} /> },
    { name: 'Employee', icon: <Users size={20} />,
      subItems: [
        { name: 'All Employees', path: '/employees' },
        { name: 'Designation', path: '/designations', roles: ['admin', 'manager'] },
        { name: 'Employment Status', path: '/employment-status', roles: ['admin', 'manager'] }
      ]
    },
    { name: 'Leave', icon: <CalendarDays size={20} />,
      subItems: [
        { name: 'Leave Status', path: '/leaves/status', roles: ['admin', 'manager'] },
        { name: 'Leave Request', path: '/leaves/request' },
        { name: 'Calendar', path: '/leaves/calendar' },
        { name: 'Summary', path: '/leaves/summary', roles: ['admin', 'manager'] }
      ]
    },
    { name: 'Attendance', icon: <Clock size={20} />, roles: ['admin', 'manager'],
      subItems: [
        { name: 'Daily Log', path: '/attendance/daily-log' },
        { name: 'Attendance Details', path: '/attendance/details' },
        { name: 'Attendance Request', path: '/attendance/request' }
      ]
    },
    { name: 'Payroll', icon: <Banknote size={20} />,
      subItems: [
        { name: 'Payrun', path: '/payroll/payrun', roles: ['admin', 'manager', 'accounting'] },
        { name: 'Payslip', path: '/payroll/payslip' },
        { name: 'Beneficiary', path: '/payroll/beneficiary', roles: ['admin', 'manager', 'accounting'] },
        { name: 'Rate Matrix', path: '/payroll/rate-matrix', enhanced: true, roles: ['admin', 'manager'] },
        { name: 'Accounting Batch', path: '/payroll/accounting-batch', enhanced: true, roles: ['admin', 'manager', 'accounting'] }
      ]
    },
    { name: 'Administration', icon: <ShieldAlert size={20} />, roles: ['admin', 'manager'],
      subItems: [
        { name: 'Users & Roles', path: '/admin/roles' },
        { name: 'Work Shifts', path: '/admin/shifts' },
        { name: 'Departments', path: '/admin/departments' },
        { name: 'Holiday', path: '/admin/holidays' },
        { name: 'Org. Structure', path: '/admin/org-structure' },
        { name: 'Announcements', path: '/admin/announcements' },
        { name: 'Biometric Manager', path: '/admin/biometrics', enhanced: true },
        { name: 'Unify Sync', path: '/admin/unify-sync', enhanced: true }
      ]
    },
    { name: 'Assets', path: '/assets', icon: <Package size={20} />, roles: ['admin', 'manager', 'warehouseadmin'] },
    { name: 'Settings', icon: <Settings size={20} />, roles: ['admin'],
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

  // RBAC Filtering Logic
  const hasAccess = (item) => {
    if (!item.roles) return true;
    const userRole = user?.access_level?.toLowerCase() || 'user';
    return item.roles.includes(userRole);
  };

  const filteredNavItems = navItems.map(item => {
    if (item.subItems) {
      return {
        ...item,
        subItems: item.subItems.filter(hasAccess)
      };
    }
    return item;
  }).filter(item => {
    if (!hasAccess(item)) return false;
    if (item.subItems && item.subItems.length === 0) return false;
    return true;
  });

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/maskpro_logo.png" alt="MaskPro" style={{ width: '36px', height: '36px', minWidth: '36px', flexShrink: 0, borderRadius: '8px', objectFit: 'contain', background: '#fff', padding: '2px' }} />
          <span>MaskPro <span style={{ color: '#818cf8' }}>HRIS</span></span>
        </div>
        
        <nav className="sidebar-nav">
          {filteredNavItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <div className="nav-item" onClick={() => toggleMenu(item.name)} style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.icon}<span>{item.name}</span>
                    </div>
                    {expandedMenus[item.name] ? <ChevronDown size={14} style={{ opacity: 0.5 }} /> : <ChevronRight size={14} style={{ opacity: 0.5 }} />}
                  </div>
                  {expandedMenus[item.name] && (
                    <div className="sub-menu" style={{ marginLeft: '44px', marginTop: '4px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '2px', animation: 'slideDown 0.2s ease-out' }}>
                      {item.subItems.map(sub => (
                        <NavLink key={sub.name} to={sub.path}
                          style={({ isActive }) => ({
                            fontSize: '13px', padding: '7px 0',
                            color: isActive ? '#818cf8' : 'rgba(255,255,255,0.45)',
                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.2s ease', fontWeight: isActive ? '600' : '400'
                          })}
                        >
                          {sub.enhanced && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />}
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
                  {item.icon}<span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
            <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name || 'User'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user?.access_level || 'Staff'}</div>
            </div>
            <LogOut size={16} style={{ color: '#f43f5e', cursor: 'pointer', flexShrink: 0 }} onClick={handleLogout} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HRIS Portal</h2>
          </div>
          {user?.impersonator && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '6px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: '500' }}>Viewing as <strong>{user.full_name}</strong></span>
              <button onClick={() => { revertImpersonation(); window.location.reload(); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Go Back</button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.06)' }}>
              <Bell size={18} color="#6366f1" />
              <span style={{ position: 'absolute', top: '4px', right: '4px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', fontSize: '9px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: '700' }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{user?.full_name || 'User'}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.access_level || 'Staff'}</div>
              </div>
              <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
