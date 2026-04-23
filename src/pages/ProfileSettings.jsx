import React, { useState, useEffect, useContext } from 'react';
import { Upload, User, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Local state for the avatar to update immediately
  const [currentAvatar, setCurrentAvatar] = useState(user?.profile_picture || null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/employees/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hris_token')}`
          // Do NOT set Content-Type, browser sets it automatically with the boundary for FormData
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Profile picture updated successfully!');
        setCurrentAvatar(data.avatarUrl);
        setFile(null);
        // Dispatch event so layout topbar can update
        window.dispatchEvent(new Event('avatarUpdate'));
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', letterSpacing: '-0.02em' }}>Profile Settings</h1>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Avatar Section */}
        <div style={{ flex: '0 0 160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '16px'
          }}>
            {preview || currentAvatar ? (
              <img src={preview || currentAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color="#94a3b8" />
            )}
          </div>
          
          <label style={{ 
            background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', 
            borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', color: '#475569',
            transition: 'all 0.2s'
          }}>
            <Upload size={14} />
            Choose Photo
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 4px 0' }}>{user?.full_name || user?.username}</h2>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{user?.job_title || 'Employee'}</p>
          </div>

          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Username</label>
                <input type="text" value={user?.username || ''} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', outline: 'none' }} />
              </div>
            </div>

            {error && <div style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            {success && <div style={{ padding: '12px', background: '#ecfdf5', color: '#10b981', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> {success}</div>}

            <button 
              type="submit" 
              disabled={!file || loading}
              style={{ 
                background: (!file || loading) ? '#cbd5e1' : '#6366f1', 
                color: 'white', border: 'none', padding: '12px 24px', 
                borderRadius: '8px', fontWeight: '600', cursor: (!file || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Uploading...' : 'Save Profile Picture'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
