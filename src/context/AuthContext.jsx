// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// 1. Auth Context'i oluşturuyoruz
export const AuthContext = createContext();

// 2. Auth Provider bileşenini oluşturuyoruz
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde token varsa kullanıcı bilgilerini getir
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Kullanıcı profilini getir
  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Profil yüklenemedi:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Kayıt olma fonksiyonu
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsLoggedIn(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Giriş yapma fonksiyonu
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsLoggedIn(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      userEmail: user?.email || '',
      loading,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context'i kullanmak için kolaylık sağlayan custom hook
export const useAuth = () => useContext(AuthContext);
