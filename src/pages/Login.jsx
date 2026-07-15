import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { Compass, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: saveAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        saveAuth(response);
        navigate('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="modal-content form-modal-content animate-fade-in" style={{ maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-pure)' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px 32px 16px 32px' }}>
          <div className="logo" style={{ cursor: 'pointer', fontSize: '1.6rem' }} onClick={() => navigate('/')}>
            <Compass size={32} style={{ color: 'var(--primary)' }} />
            <span>Stay</span>Red
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', marginTop: '16px' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
            Sign in to check and manage your hotel stays.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div style={{
            margin: '0 32px 16px 32px',
            padding: '12px',
            backgroundColor: '#fff0f2',
            border: '1px solid #ffccd3',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--primary-dark)',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-hotel-form" style={{ padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-block">
            <label htmlFor="login-email" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              id="login-email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="login-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              id="login-password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="add-hotel-submit-btn" 
            style={{ width: '100%', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Create One
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
