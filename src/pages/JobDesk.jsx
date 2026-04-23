import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

const JobDesk = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.username?.toLowerCase().includes(search.toLowerCase()) ||
    emp.unify_job_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>All Employees</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>Manage staff directory and roles</p>
        </div>
        <button className="btn-primary">Add Employee</button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search employees by name, role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }}>
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Employee</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Role (Unify)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</th>
                {['ryan', 'karen'].includes(user?.username) && (
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Base Rate</th>
                )}
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading directory...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.user_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-background)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {emp.full_name ? emp.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{emp.full_name || emp.username}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>@{emp.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '999px', fontSize: '0.875rem' }}>
                        {emp.unify_job_title || emp.access_level}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {emp.is_active ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem' }}>
                          <CheckCircle size={16} /> Active
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.875rem' }}>
                          <XCircle size={16} /> Inactive
                        </div>
                      )}
                    </td>
                    {['ryan', 'karen'].includes(user?.username) && (
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                        ₱{emp.base_hourly_rate || '0.00'} / hr
                      </td>
                    )}
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobDesk;
