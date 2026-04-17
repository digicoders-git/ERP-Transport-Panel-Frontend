import React, { createContext, useState, useEffect } from 'react';
import { driverAuthAPI } from '../api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with email:', email);
      const response = await driverAuthAPI.login(email, password);
      console.log('AuthContext: Login response:', response.data);
      
      if (response.data?.token && response.data?.driver) {
        const { token: tokenData, driver } = response.data;
        
        localStorage.setItem('token', tokenData);
        localStorage.setItem('user', JSON.stringify(driver));
        
        setToken(tokenData);
        setUser(driver);
        
        toast.success('✅ Login successful!');
        return true;
      } else {
        toast.error('❌ Login failed');
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(`❌ ${msg}`);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('👋 Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
