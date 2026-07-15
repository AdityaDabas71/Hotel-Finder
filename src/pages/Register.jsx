import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { Compass, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }

    // Email pattern check
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await register(name, email, password);
      if (response.success) {
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
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
            Create an Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
            Join StayRed and find your perfect hotel stay.
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
            <label htmlFor="reg-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Full Name
            </label>
            <input 
              type="text" 
              id="reg-name" 
              placeholder="e.g. John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="reg-email" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              id="reg-email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="reg-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              id="reg-password" 
              placeholder="Min. 6 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="reg-confirm-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Confirm Password
            </label>
            <input 
              type="password" 
              id="reg-confirm-password" 
              placeholder="Re-enter your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="add-hotel-submit-btn" 
            style={{ width: '100%', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
