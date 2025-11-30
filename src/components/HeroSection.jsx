// src/components/HeroSection.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaCheese, FaDrumstickBite, FaSeedling, FaLeaf } from 'react-icons/fa';
import './HeroSection.css';

// Kategori ikonlarını döndüren yardımcı fonksiyon
const getCategoryIcon = (categoryId) => {
  switch (categoryId) {
    case 'sut-urunleri':
      return <FaCheese className="hero-category-icon" />;
    case 'et-urunleri':
      return <FaDrumstickBite className="hero-category-icon" />;
    case 'tarla-gubr':
      return <FaSeedling className="hero-category-icon" />;
    case 'baharatlar':
      return <FaLeaf className="hero-category-icon" />;
    default:
      return null;
  }
};

// Kategori görünen adını döndüren yardımcı fonksiyon
const getCategoryDisplayName = (categoryId) => {
  switch (categoryId) {
    case 'sut-urunleri':
      return 'Süt Ürünleri';
    case 'et-urunleri':
      return 'Et Ürünleri';
    case 'tarla-gubr':
      return 'Tarla Gübreleri';
    case 'baharatlar':
      return 'Baharatlar';
    default:
      return 'Kategori';
  }
};

function HeroSection() {
  const allCategories = ['sut-urunleri', 'et-urunleri', 'tarla-gubr', 'baharatlar'];
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
              key={category} 
              to={`/categories/${category}`} 
              className={`category-card-3d ${getCardClass(index)}`}
              onClick={(e) => {
                if (getCardClass(index) !== 'card-active') {
                  e.preventDefault();
                  // Tıklanan karta göre kaydır
                  const diff = (index - currentIndex + allCategories.length) % allCategories.length;
                  if (diff === 1) {
                    handleNext();
                  } else if (diff === allCategories.length - 1) {
                    handlePrev();
                  }
                }
              }}
            >
              {getCategoryIcon(category)}
              <h3 className="category-name-3d">{getCategoryDisplayName(category)}</h3>
            </NavLink>
          ))}
        </div>
        
        <button className="carousel-nav-btn right-btn" onClick={handleNext}>
          ❯
        </button>
      </div>
      
      <div className="carousel-dots">
        {allCategories.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;