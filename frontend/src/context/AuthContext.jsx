import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      role: userData.role?.name || userData.role || 'USER',
    };
    setUser(normalizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const isSuperOwner = user?.isSuperOwner === true || (user?.role === 'OWNER' && user?.email === 'sribalajimedisystemsofficial@gmail.com');
  const isTechnician = user?.role === 'TECHNICIAN' || user?.role === 'ROLE_TECHNICIAN';
  const isCustomer = isAuthenticated && !isOwner && !isTechnician;

  const value = {
    user,
    isAuthenticated,
    isOwner,
    isSuperOwner,
    isTechnician,
    isCustomer,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
