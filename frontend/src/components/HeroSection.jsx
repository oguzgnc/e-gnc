// src/components/HeroSection.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaCheese, FaDrumstickBite, FaSeedling, FaLeaf, FaHome } from 'react-icons/fa';
import { MousePointerClick } from 'lucide-react';
import antrikotImg from '../assets/antrikot.webp';
import mantiImg from '../assets/mantı1.webp';
import kiymaImg from '../assets/kıyma.webp';
import './HeroSection.css';

// Kategori ikonlarını döndüren yardımcı fonksiyon
const getCategoryIcon = (categoryId) => {
  switch (categoryId) {
    case 'sut-urunleri':
      return <FaCheese className="hero-category-icon" />;
    case 'et-urunleri':
      return <FaDrumstickBite className="hero-category-icon" />;
    case 'tarla-gubreleri':
      return <FaSeedling className="hero-category-icon" />;
    case 'ev-esyalari':
      return <FaHome className="hero-category-icon" />;
    case 'baharatlar':
      return <FaLeaf className="hero-category-icon" />;
    default:
      return null;
  }
};


const DEFAULT_CATEGORIES = [
  { slug: 'sut-urunleri',    name: 'Süt Ürünleri' },
  { slug: 'et-urunleri',     name: 'Et Ürünleri' },
  { slug: 'tarla-gubreleri', name: 'Tarla Gübreleri' },
  { slug: 'baharatlar',      name: 'Baharatlar' },
  { slug: 'ev-esyalari',     name: 'Ev Eşyaları' }
];

function HeroSection() {
  const [allCategories, setAllCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${(import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://gncsarkuteri-backend.onrender.com/api' : 'http://localhost:5000/api')).replace(/\/$/, '')}/categories`);
        const data = await res.json();
        if (data && data.categories && data.categories.length > 0) {
          setAllCategories(data.categories.map(c => ({ slug: c.slug, name: c.name })));
        }
      } catch (err) {
        console.error('Kategori yüklenemedi:', err);
      }
    };

    fetchCategories();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allCategories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allCategories.length - 1 : prevIndex - 1
    );
  };

  const getCardClass = (index) => {
    const diff = (index - currentIndex + allCategories.length) % allCategories.length;
    
    if (diff === 0) return 'card-active'; // En önde
    if (diff === 1) return 'card-right'; // Sağda
    if (diff === allCategories.length - 1) return 'card-left'; // Solda
    return 'card-hidden'; // Gizli
  };

  return (
    <section className="hero-categories-only">
      <div className="carousel-3d-container">
        <button className="carousel-nav-btn left-btn" onClick={handlePrev}>
          ❮
        </button>
        
        <div className="carousel-3d">
          {allCategories.map((category, index) => (
            <NavLink 
              key={category.slug} 
              to={`/categories/${category.slug}`} 
              className={`category-card-3d ${getCardClass(index)}`}
              onClick={(e) => {
                if (getCardClass(index) !== 'card-active') {
                  e.preventDefault();
                  const diff = (index - currentIndex + allCategories.length) % allCategories.length;
                  if (diff === 1) {
                    handleNext();
                  } else if (diff === allCategories.length - 1) {
                    handlePrev();
                  }
                }
              }}
            >
              {getCategoryIcon(category.slug)}
              <h3 className="category-name-3d">{category.name}</h3>
            </NavLink>
          ))}
        </div>
        
        <button className="carousel-nav-btn right-btn" onClick={handleNext}>
          ❯
        </button>

        <Link to="/tarifler" className="recipe-promo-card">
          <span className="recipe-promo-eyebrow">👨‍🍳 Şefin Önerisi</span>
          <div className="recipe-promo-content">
            <h2>Bugün Ne Pişirsem?</h2>
            <p>Harika tarifler ve tüm malzemeler tek tıkla sepetinde.</p>
          </div>
          <div className="recipe-promo-gallery" aria-hidden="true">
            <img src={antrikotImg} className="object-cover w-full h-full" alt="" />
            <img src={mantiImg} className="object-cover w-full h-full" alt="" />
            <img src={kiymaImg} className="object-cover w-full h-full" alt="" />
          </div>
          <span className="recipe-promo-cta">
            <MousePointerClick className="recipe-discovery-icon" size={20} aria-hidden="true" />
            Tarifleri Keşfet
          </span>
        </Link>
      </div>
      
      <div className="carousel-dots">
        {allCategories.map((category, index) => (
          <button
            key={category.slug}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;