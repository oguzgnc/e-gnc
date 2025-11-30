// src/App.jsx

import React from 'react';
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

// ! Ürün verilerini merkezi dosyadan import ediyoruz !
import { products } from './data/products';


function App() {
  return (
    <div className="App">
      <Navbar /> 
      <HeroSection /> 

      <main className="main-content">
        {/* Hakkımızda bölümü - Artık HeroSection içinde */}
        {/* <AboutUsSection /> */}
        
        {/* Tüm Ürünler için Kaydırılabilir Bölüm */}
        {/* products prop'una tüm ürünler dizisini gönderiyoruz */}
        <ProductCarousel 
          title="Tüm Ürünlerimiz" 
          products={products} 
        />
        
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