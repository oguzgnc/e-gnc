// src/components/CategoryPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { products } from '../data/products'; 
import './CategoryPage.css'; 
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';

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
      return 'Tüm Ürünler';
  }
};

function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightProductId = searchParams.get('highlight');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const categoryDisplayName = getCategoryDisplayName(categoryId);

  const { addToCart } = useCart();

  useEffect(() => {
    let currentProducts = [];
    if (categoryId) {
      currentProducts = products.filter(product => product.category === categoryId);
    } else {
      currentProducts = products;
    }

    if (highlightProductId) {
      const highlightedProduct = currentProducts.find(p => p.id === highlightProductId);
      if (highlightedProduct) {
        const otherProducts = currentProducts.filter(p => p.id !== highlightProductId);
        currentProducts = [highlightedProduct, ...otherProducts];
      }
    }
    setFilteredProducts(currentProducts);

  }, [categoryId, highlightProductId]);

  const handleAddToCart = (product) => {
    const selectedOption = product.options ? product.options[0] : null;
    if (selectedOption) {
      const success = addToCart(product, selectedOption, 1);
      if (success) {
        alert(`${product.name} (${selectedOption.volume}) sepete eklendi!`);
      }
    } else {
      alert(`Ürününüzün (${product.name}) seçenekleri bulunamadı. Lütfen ürün detay sayfasından ekleyiniz.`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="category-page">
        <div className="category-header">
          <h1>{categoryDisplayName}</h1>
          <p className="category-subtitle">
            {filteredProducts.length} ürün bulundu
          </p>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p className="no-products-message">Bu kategoride henüz ürün bulunmamaktadır.</p>
        ) : (
          <div className="category-products-grid">
            {filteredProducts.map(product => (
              <div className="category-product-card" key={product.id}>
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="category-product-image" />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-volume">{product.options && product.options[0] ? product.options[0].volume : 'Birim'}</p>
                  <div className="product-footer">
                    <p className="product-price">{product.price} TL</p>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Küçük İletişim Bölümü */}
        <div className="mini-contact-section">
          <h3>İletişim</h3>
          <div className="mini-contact-info">
            <span>📍 Konya, Türkiye</span>
            <span>📞 +90 5XX XXX XX XX</span>
            <span>✉️ info@gncsarkuteri.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;