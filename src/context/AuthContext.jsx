// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Auth Context'i oluşturuyoruz
export const AuthContext = createContext();

// 2. Auth Provider bileşenini oluşturuyoruz
export const AuthProvider = ({ children }) => {
  // Kullanıcı giriş durumunu tutmak için state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Sayfa yenilendiğinde giriş durumunu localStorage'dan yükle
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    return savedLoginStatus === 'true';
  });

  const [userEmail, setUserEmail] = useState(() => {
    // Kullanıcı email'ini de saklayalım
    return localStorage.getItem('userEmail') || '';
  });

  // Giriş durumu her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    if (isLoggedIn) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [isLoggedIn, userEmail]);

  // Giriş yapma fonksiyonu
  const login = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    // Sepeti temizle
    localStorage.removeItem('cartItems');
    // Sayfayı yenile ki sepet boş görünsün
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      userEmail,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Context'i kullanmak için kolaylık sağlayan custom hook
export const useAuth = () => useContext(AuthContext);
