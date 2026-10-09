import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getAdminProfile, changeAdminPassword as apiChangePassword } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('huyhoang_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      if (token) {
        try {
          const res = await getAdminProfile();
          if (res.data.success) {
            setAdmin(res.data.data);
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    }
    loadAdmin();
  }, [token]);

  const login = async (username, password) => {
    const res = await loginAdmin({ username, password });
    if (res.data.success) {
      const { token: newToken, admin: adminData } = res.data.data;
      localStorage.setItem('huyhoang_admin_token', newToken);
      setToken(newToken);
      setAdmin(adminData);
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Đăng nhập thất bại' };
  };

  const logout = () => {
    localStorage.removeItem('huyhoang_admin_token');
    localStorage.removeItem('huyhoang_admin_user');
    setToken(null);
    setAdmin(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await apiChangePassword({ currentPassword, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!token && !!admin, loading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
