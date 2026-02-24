// src/components/CartPage.jsx

import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // Sepet Context'ini kullanmak için
import { useAuth } from '../context/AuthContext'; // Auth Context'ini kullanmak için
import { orderAPI } from '../services/api'; // Order API
import './CartPage.css'; // Stil dosyası
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
const imgBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    orderNote: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleCheckoutClick = () => {
    // Kullanıcı bilgilerini önceden doldur (giriş yaptıysa)
    if (user) {
      setOrderForm(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
    
    setShowCheckoutModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata varsa temizle
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!orderForm.email.trim()) errors.email = 'E-posta gereklidir';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderForm.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    if (!orderForm.fullName.trim()) errors.fullName = 'Ad Soyad gereklidir';
    if (!orderForm.phone.trim()) errors.phone = 'Telefon numarası gereklidir';
    else if (!/^[0-9]{10,11}$/.test(orderForm.phone.replace(/\s/g, ''))) {
      errors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    if (!orderForm.city.trim()) errors.city = 'İl gereklidir';
    if (!orderForm.district.trim()) errors.district = 'İlçe gereklidir';
    if (!orderForm.address.trim()) errors.address = 'Adres gereklidir';
    else if (orderForm.address.trim().length < 10) {
      errors.address = 'Lütfen daha detaylı bir adres giriniz';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const shippingAddress = `${orderForm.fullName}\nE-posta: ${orderForm.email}\nTelefon: ${orderForm.phone}\n${orderForm.address}\n${orderForm.district}/${orderForm.city}${orderForm.orderNote ? '\nNot: ' + orderForm.orderNote : ''}`;
      
      const orderData = {
        cartItems: cartItems,
        totalPrice: getCartTotal(),
        shippingAddress: shippingAddress,
        customerEmail: orderForm.email,
        customerName: orderForm.fullName
      };

      const response = await orderAPI.createOrder(orderData);

      if (response.success) {
        alert('🎉 Siparişiniz başarıyla oluşturuldu! En kısa sürede tarafınıza ulaşacaktır.');
        clearCart();
        setShowCheckoutModal(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      setError(error.message || 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
                <img src={item.product.image && (item.product.image.startsWith('/uploads') || item.product.image.startsWith('/api/uploads')) ? `${imgBaseUrl}${item.product.image}` : item.product.image} alt={item.product.name} className="cart-item-image" />
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
            <button 
              className="checkout-button" 
              onClick={handleCheckoutClick}
            >
              Siparişi Tamamla
            </button>
            <button className="continue-shopping-button" onClick={() => navigate('/')}>Alışverişe Devam Et</button>
          </div>
        </div>
      )}

      {/* Sipariş Formu Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Sipariş Bilgileri</h2>
              <button className="close-modal-btn" onClick={() => setShowCheckoutModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Ad Soyad *</label>
                <input
                  type="text"
                  name="fullName"
                  value={orderForm.fullName}
                  onChange={handleFormChange}
                  placeholder="Ahmet Yılmaz"
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>E-posta Adresi *</label>
                <input
                  type="email"
                  name="email"
                  value={orderForm.email}
                  onChange={handleFormChange}
                  placeholder="ornek@email.com"
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Telefon Numarası *</label>
                <input
                  type="tel"
                  name="phone"
                  value={orderForm.phone}
                  onChange={handleFormChange}
                  placeholder="0555 555 55 55"
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>İl *</label>
                  <input
                    type="text"
                    name="city"
                    value={orderForm.city}
                    onChange={handleFormChange}
                    placeholder="Konya"
                    className={formErrors.city ? 'error' : ''}
                  />
                  {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label>İlçe *</label>
                  <input
                    type="text"
                    name="district"
                    value={orderForm.district}
                    onChange={handleFormChange}
                    placeholder="Selçuklu"
                    className={formErrors.district ? 'error' : ''}
                  />
                  {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Adres *</label>
                <textarea
                  name="address"
                  value={orderForm.address}
                  onChange={handleFormChange}
                  placeholder="Mahalle, Sokak, Bina No, Daire No..."
                  rows="3"
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && <span className="error-text">{formErrors.address}</span>}
              </div>

              <div className="form-group">
                <label>Sipariş Notu (Opsiyonel)</label>
                <textarea
                  name="orderNote"
                  value={orderForm.orderNote}
                  onChange={handleFormChange}
                  placeholder="Kapı kodu, teslimat zamanı tercihi vb..."
                  rows="2"
                />
              </div>

              <div className="order-summary-modal">
                <div className="summary-item">
                  <span>Toplam Tutar:</span>
                  <span className="total-price">{getCartTotal().toFixed(2)} ₺</span>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowCheckoutModal(false)}
                disabled={loading}
              >
                İptal
              </button>
              <button 
                className="btn-submit" 
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'İşleniyor...' : '✓ Siparişi Onayla'}
              </button>
            </div>
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