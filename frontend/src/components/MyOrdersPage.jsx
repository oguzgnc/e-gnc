// src/components/MyOrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './MyOrdersPage.css';

function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Siparişleriniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-header">
        <h1>📦 Siparişlerim</h1>
        <p className="orders-subtitle">Geçmiş siparişlerinizi buradan takip edebilirsiniz</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">🛒</div>
          <h2>Henüz Siparişiniz Yok</h2>
          <p>İlk siparişinizi oluşturmak için alışverişe başlayın!</p>
          <button className="btn-start-shopping" onClick={() => navigate('/')}>
            Alışverişe Başla
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-number">
                    <span className="label">Sipariş No:</span>
                    <span className="value">#{order.id}</span>
                  </div>
                  <div className="order-date">
                    <span className="date-icon">📅</span>
                    {new Date(order.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="order-status-container">
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-item">
                  <span className="summary-label">Toplam Tutar:</span>
                  <span className="summary-value price">
                    {parseFloat(order.total_price).toFixed(2)} ₺
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ürün Sayısı:</span>
                  <span className="summary-value">
                    {order.items ? order.items.length : 0} ürün
                  </span>
                </div>
              </div>

              <button 
                className="btn-toggle-details"
                onClick={() => toggleOrderExpand(order.id)}
              >
                {expandedOrders.includes(order.id) ? '▼ Detayları Gizle' : '▶ Detayları Göster'}
              </button>

              {expandedOrders.includes(order.id) && (
                <div className="order-details">
                  <div className="details-section">
                    <h4>🛍️ Sipariş İçeriği</h4>
                    <div className="order-items">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-info">
                              <span className="item-name">{item.product_name}</span>
                              <span className="item-volume">{item.volume}</span>
                            </div>
                            <div className="item-pricing">
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">
                                {parseFloat(item.price * item.quantity).toFixed(2)} ₺
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-items">Ürün bilgisi bulunamadı</p>
                      )}
                    </div>
                  </div>

                  {order.shipping_address && (
                    <div className="details-section">
                      <h4>📍 Teslimat Bilgileri</h4>
                      <div className="shipping-info">
                        <pre>{order.shipping_address}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
