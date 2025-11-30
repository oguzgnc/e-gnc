// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// 1. Cart Context'i oluşturuyoruz
export const CartContext = createContext();

// 2. Cart Provider bileşenini oluşturuyoruz
export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  // Sepet verilerini tutmak için state
  // Her bir ürün { product, selectedOption, quantity } şeklinde olacak
  const [cartItems, setCartItems] = useState(() => {
    // Sayfa yenilendiğinde sepeti localStorage'dan yükle
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sepet her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sepete ürün ekleme fonksiyonu
  const addToCart = (product, selectedOption, quantity) => {
    if (!isLoggedIn) {
      alert('⚠️ Sepete ürün eklemek için giriş yapmanız gerekmektedir!');
      return false;
    }
    
    setCartItems(prevItems => {
      // Sepette aynı ürün ve aynı seçenek var mı kontrol et
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedOption.volume === selectedOption.volume
      );

      if (existingItemIndex > -1) {
        // Varsa miktarını artır
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Yoksa yeni ürün olarak ekle
        return [...prevItems, { product, selectedOption, quantity }];
      }
    });
    return true;
  };

  // Sepetten ürün çıkarma fonksiyonu
  const removeFromCart = (productId, optionVolume) => {
    setCartItems(prevItems => prevItems.filter(
      item => !(item.product.id === productId && item.selectedOption.volume === optionVolume)
    ));
  };

  // Sepetteki ürün miktarını güncelleme fonksiyonu
  const updateQuantity = (productId, optionVolume, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.product.id === productId && item.selectedOption.volume === optionVolume) {
          return { ...item, quantity: Math.max(1, newQuantity) }; // Miktar 1'in altına düşmez
        }
        return item;
      });
    });
  };

  // Sepet toplamını hesaplama (her ürünün fiyatı * miktarı)
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.selectedOption.price * item.quantity);
    }, 0);
  };

  // Sepetteki toplam ürün adedi (farklı ürünleri sayar, aynı ürünün farklı seçenekleri ayrı ürün gibi davranır)
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };


  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Context'i kullanmak için kolaylık sağlayan custom hook
export const useCart = () => useContext(CartContext);