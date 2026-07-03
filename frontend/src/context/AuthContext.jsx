import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    const data = await authService.login(userData);
    setUser({ token: data.token, ...data.user });
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser({ token: data.token, ...data.user });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
