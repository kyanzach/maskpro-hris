import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hris_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set default auth headers for axios
  const setAuthToken = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('hris_token');
      const storedUser = localStorage.getItem('hris_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        setAuthToken(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // In production, use relative URL since Nginx proxies /api to port 3001
      // In local dev, use the full URL to the local Node instance
      const apiUrl = import.meta.env.PROD ? '/api/auth/login' : 'http://127.0.0.1:3001/api/auth/login';
      
      const res = await axios.post(apiUrl, { username, password });
      
      if (res.data.success) {
        const { token: jwtToken, user: userData } = res.data;
        
        localStorage.setItem('hris_token', jwtToken);
        localStorage.setItem('hris_user', JSON.stringify(userData));
        
        setToken(jwtToken);
        setUser(userData);
        setIsAuthenticated(true);
        setAuthToken(jwtToken);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again later.' 
      };
    }
  };

  const impersonate = async (targetUserId) => {
    try {
      const apiUrl = import.meta.env.PROD ? '/api/auth/impersonate' : 'http://127.0.0.1:3001/api/auth/impersonate';
      const res = await axios.post(apiUrl, { target_user_id: targetUserId });
      
      if (res.data.success) {
        // Save original admin token before swapping
        localStorage.setItem('hris_admin_token', token);
        localStorage.setItem('hris_admin_user', JSON.stringify(user));
        
        const { token: jwtToken, user: userData } = res.data;
        localStorage.setItem('hris_token', jwtToken);
        localStorage.setItem('hris_user', JSON.stringify(userData));
        
        setToken(jwtToken);
        setUser(userData);
        setAuthToken(jwtToken);
        
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to impersonate.' };
    }
  };

  const revertImpersonation = () => {
    const adminToken = localStorage.getItem('hris_admin_token');
    const adminUser = localStorage.getItem('hris_admin_user');
    
    if (adminToken && adminUser) {
      localStorage.setItem('hris_token', adminToken);
      localStorage.setItem('hris_user', adminUser);
      localStorage.removeItem('hris_admin_token');
      localStorage.removeItem('hris_admin_user');
      
      setToken(adminToken);
      setUser(JSON.parse(adminUser));
      setAuthToken(adminToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('hris_token');
    localStorage.removeItem('hris_user');
    localStorage.removeItem('hris_admin_token');
    localStorage.removeItem('hris_admin_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, impersonate, revertImpersonation }}>
      {children}
    </AuthContext.Provider>
  );
};
