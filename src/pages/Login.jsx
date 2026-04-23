import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Please enter both username and password.'); return; }
    setIsSubmitting(true);
    const result = await login(username, password);
    if (result.success) { navigate(from, { replace: true }); }
    else { setError(result.message); setIsSubmitting(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 30%, #06b6d4 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Floating orbs */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', top: '-100px', right: '-100px', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', bottom: '-80px', left: '-80px', borderRadius: '50%' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>M</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.03em' }}>
            MaskPro HRIS
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem' }}>
            Sign in using your Unify Suite credentials
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: '24px', padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden'
        }}>
          {/* Top gradient accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fca5a5',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '24px'
            }}>
              <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#be123c' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Username
              </label>
              <input
                type="text" autoComplete="username" required
                value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Unify username"
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '2px solid #e2e8f0', borderRadius: '12px',
                  fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc',
                  outline: 'none', transition: 'all 0.2s ease'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    border: '2px solid #e2e8f0', borderRadius: '12px',
                    fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc',
                    outline: 'none', transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: '#94a3b8', display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button type="submit" disabled={isSubmitting}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 8px 25px rgba(99,102,241,0.35)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => { if (!isSubmitting) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 35px rgba(99,102,241,0.45)'; }}}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 25px rgba(99,102,241,0.35)'; }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
