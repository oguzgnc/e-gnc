// src/components/CategoryPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import './CategoryPage.css'; 
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
const imgBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

const getCategoryDisplayName = (categoryId) => {
  switch (categoryId) {
    case 'sut-urunleri':
      return 'Süt Ürünleri';
    case 'et-urunleri':
      return 'Et Ürünleri';
    case 'ev-esyalari':
      return 'Ev Eşyaları';
    case 'tarla-gubreleri':
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
  const [loading, setLoading] = useState(true);
  const categoryDisplayName = getCategoryDisplayName(categoryId);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getAllProducts();
        let currentProducts = response.products || [];
        
        // Kategori filtreleme
        if (categoryId) {
          currentProducts = currentProducts.filter(product => product.category === categoryId);
        }

        // Stokta olmayanları gösterme
        currentProducts = currentProducts.filter(product => product.in_stock !== false);

        // Highlight edilen ürünü en üste al
        if (highlightProductId) {
          const highlightedProduct = currentProducts.find(p => p.product_id === highlightProductId);
          if (highlightedProduct) {
            const otherProducts = currentProducts.filter(p => p.product_id !== highlightProductId);
            currentProducts = [highlightedProduct, ...otherProducts];
          }
        }
        
        setFilteredProducts(currentProducts);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, highlightProductId]);

  const handleAddToCart = (product) => {
    // Normalize options to array and provide a default option if none exist
    let parsedOptions = [];
    try {
      if (typeof product.options === 'string') {
        parsedOptions = JSON.parse(product.options || '[]');
      } else if (Array.isArray(product.options)) {
        parsedOptions = product.options;
      } else if (product.options && typeof product.options === 'object') {
        parsedOptions = [product.options];
      } else {
        parsedOptions = [];
      }
    } catch (e) {
      parsedOptions = [];
    }

    if (!parsedOptions || parsedOptions.length === 0) {
      // Fallback: create a default option from product.price
      parsedOptions = [{ volume: 'Standart', price: Number(product.price) || 0 }];
    }

    const selectedOption = parsedOptions[0];
    const success = addToCart(product, selectedOption, 1);
    if (success) {
      alert(`${product.name} (${selectedOption.volume}) sepete eklendi!`);
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
        
        {loading ? (
          <p className="loading-message">Ürünler yükleniyor...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="no-products-message">Bu kategoride henüz ürün bulunmamaktadır.</p>
        ) : (
          <div className="category-products-grid">
            {filteredProducts.map(product => {
              const parsedOptions = typeof product.options === 'string' 
                ? JSON.parse(product.options) 
                : product.options;
              
              return (
                <div className="category-product-card" key={product.id}>
                  <div className="product-image-wrapper">
                    <img src={product.image && (product.image.startsWith('/uploads') || product.image.startsWith('/api/uploads')) ? `${imgBaseUrl}${product.image}` : product.image} alt={product.name} className="category-product-image" />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-volume">
                      {parsedOptions && parsedOptions[0] ? parsedOptions[0].volume : 'Birim'}
                    </p>
                    <div className="product-footer">
                      <p className="product-price">{Number(product.price).toFixed(2)} TL</p>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Sepete Ekle
                      </button>
                    </div>
                </div>
              </div>
              );
            })}
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