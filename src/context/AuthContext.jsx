import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('stayred_auth_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('stayred_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const profileData = await authService.getProfile(token);
          if (profileData.success) {
            setUser(profileData.user);
            localStorage.setItem('stayred_auth_user', JSON.stringify(profileData.user));
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const handleLogin = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('stayred_auth_token', authData.token);
    localStorage.setItem('stayred_auth_user', JSON.stringify(authData.user));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    authService.logout();
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
