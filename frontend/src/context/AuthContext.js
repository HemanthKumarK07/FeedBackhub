import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        // Ensure required fields exist
        if (decoded.id && decoded.name && decoded.role) {
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email || '',
            role: decoded.role
          });
        } else {
          console.error('Token missing required fields', decoded);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      if (res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};