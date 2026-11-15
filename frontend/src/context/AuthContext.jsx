import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('interviewpro_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync user state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('interviewpro_token');
      const savedUser = localStorage.getItem('interviewpro_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('interviewpro_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session verification failed, using cached session or clearing');
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('interviewpro_token', access_token);
      localStorage.setItem('interviewpro_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid email or password. Please try again.';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, preferred_role) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        preferred_role: preferred_role || 'Python Developer',
      });
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('interviewpro_token', access_token);
      localStorage.setItem('interviewpro_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed. Please check your details.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('interviewpro_token');
    localStorage.removeItem('interviewpro_user');
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await api.put('/auth/profile', updatedData);
      setUser(res.data);
      localStorage.setItem('interviewpro_user', JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update profile';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
