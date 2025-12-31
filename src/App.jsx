// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Ana uygulama stilleri
import Navbar from './components/Navbar'; 
import { Link } from 'react-router-dom'; // Link bileşenini import ediyoruz

// ! Tüm bileşen import'ları burada yer almalı !
import HeroSection from './components/HeroSection'; 
// import AboutUsSection from './components/AboutUsSection'; // AboutUsSection HeroSection içine taşındı
import ProductCarousel from './components/ProductCarousel'; 
import ContactSection from './components/ContactSection'; 
import BlogSection from './components/BlogSection'; 
// import AuthPage from './components/AuthPage'; // AuthPage bileşenini import ediyoruz, rota main.jsx'te tanımlı

// ! API'den ürünleri çekeceğiz !
import { productAPI } from './services/api';


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAllProducts();
        // Sadece stokta olan ürünleri göster
        const stockProducts = (response.products || []).filter(p => p.in_stock !== false);
        setProducts(stockProducts);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <Navbar /> 
      <HeroSection /> 

      <main className="main-content">
        {/* Hakkımızda bölümü - Artık HeroSection içinde */}
        {/* <AboutUsSection /> */}
        
        {/* Tüm Ürünler için Kaydırılabilir Bölüm */}
        {/* products prop'una tüm ürünler dizisini gönderiyoruz */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Ürünler yükleniyor...</div>
        ) : products.length > 0 ? (
          <ProductCarousel 
            title="Tüm Ürünlerimiz" 
            products={products} 
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>Henüz ürün bulunmamaktadır.</div>
        )}
        
        {/* Blog Bölümü (Ana Sayfa İçin Özet) */}
        <BlogSection /> 

        {/* İletişim Bölümü (Ana Sayfa İçin Özet) */}
        <ContactSection /> 
      </main>

      {/* Alt bilgi (Footer) */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} gncsarküteri. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;