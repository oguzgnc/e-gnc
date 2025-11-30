// src/components/ProductCarousel.jsx

import React, { useState } from 'react';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa'; 
import './ProductCarousel.css'; 
import { useCart } from '../context/CartContext';

function ProductCarousel({ title, products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const getCardClass = (index) => {
    const diff = (index - currentIndex + products.length) % products.length;
    
    if (diff === 0) return 'product-card-3d card-active';
    if (diff === 1) return 'product-card-3d card-right-1';
    if (diff === 2) return 'product-card-3d card-right-2';
    if (diff === products.length - 1) return 'product-card-3d card-left-1';
    if (diff === products.length - 2) return 'product-card-3d card-left-2';
    return 'product-card-3d card-hidden';
  };

  const handleAddToCart = (product) => {
    const selectedOption = product.options ? product.options[0] : null;
    if (selectedOption) {
      const success = addToCart(product, selectedOption, 1);
      if (success) {
        alert(`${product.name} (${selectedOption.volume}) sepete eklendi!`);
      }
    } else {
      alert(`Ürününüz (${product.name}) seçenekleri bulunamadı. Lütfen ürün detay sayfasından ekleyiniz.`);
    }
  };

  return (
    <section className="product-carousel-section">
      <h2>{title}</h2>
      <div className="product-carousel-3d-container">
        <button className="product-carousel-nav-btn left" onClick={handlePrev}>
          <FaAngleLeft />
        </button>
        <div className="product-carousel-3d">
          {products.map((product, index) => (
            <div className={getCardClass(index)} key={product.id}>
              <img src={product.image} alt={product.name} className="product-image-3d" />
              <h3>{product.name}</h3>
              <p className="volume">{product.volume}</p>
              <p className="price">{product.price} TL</p>
              <button 
                className="product-add-btn"
                onClick={() => handleAddToCart(product)}
              >
                Sepete Ekle
              </button>
            </div>
          ))}
        </div>
        <button className="product-carousel-nav-btn right" onClick={handleNext}>
          <FaAngleRight />
        </button>
      </div>
    </section>
  );
}

export default ProductCarousel;