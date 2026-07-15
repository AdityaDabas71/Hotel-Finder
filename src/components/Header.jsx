import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, PlusCircle, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onAddHotelClick }) {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="container header-container">
        {/* Brand Logo */}
        <div className="logo" onClick={() => navigate('/')} title="StayRed Home" style={{ cursor: 'pointer' }}>
          <Compass size={28} />
          <span>Stay</span>Red
        </div>

        {/* Navigation / Actions */}
        <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="header-btn" 
            onClick={onAddHotelClick}
            id="add-property-btn"
            title="List a new hotel"
          >
            <PlusCircle size={18} />
            <span>List Your Property</span>
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span>Welcome, {user.name}</span>
              </div>
              <button 
                className="header-btn" 
                onClick={logout}
                style={{ border: '1px solid var(--border-medium)', padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Log Out"
                id="logout-btn"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/login"
                className="header-btn" 
                style={{ background: 'var(--primary)', color: 'var(--text-inverse)', padding: '6px 14px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Sign In"
                id="login-btn"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link 
                to="/register"
                className="header-btn" 
                style={{ border: '1px solid var(--border-medium)', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Sign Up"
                id="register-btn"
              >
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
