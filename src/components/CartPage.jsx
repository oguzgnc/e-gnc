// src/components/CartPage.jsx

import React from 'react';
import { useCart } from '../context/CartContext'; // Sepet Context'ini kullanmak için
import './CartPage.css'; // Stil dosyası
import { useNavigate } from 'react-router-dom'; // Yönlendirme için

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Sepetim</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Sepetinizde ürün bulunmamaktadır.</p>
          <button className="back-to-shop-button" onClick={() => navigate('/')}>Alışverişe Başla</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item-card">
                <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.selectedOption.volume} - {item.selectedOption.price} TL</p>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.product.id, item.selectedOption.volume, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.selectedOption.volume, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="item-actions">
                  <p className="item-total">{(item.selectedOption.price * item.quantity).toFixed(2)} TL</p>
                  <button className="remove-item-button" onClick={() => removeFromCart(item.product.id, item.selectedOption.volume)}>Kaldır</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Sepet Özeti</h3>
            <div className="summary-row">
              <span>Toplam Tutar:</span>
              <span>{getCartTotal().toFixed(2)} TL</span>
            </div>
            <button className="checkout-button">Siparişi Tamamla</button>
            <button className="continue-shopping-button" onClick={() => navigate('/')}>Alışverişe Devam Et</button>
          </div>
        </div>
      )}
      
      {/* Mini İletişim Bölümü */}
      <div className="mini-contact-section">
        <h3>İletişim</h3>
        <div className="mini-contact-info">
          <span>📍 Konya, Türkiye</span>
          <span>📞 +90 5XX XXX XX XX</span>
          <span>✉️ info@gncsarkuteri.com</span>
        </div>
      </div>
    </div>
  );
}

export default CartPage;