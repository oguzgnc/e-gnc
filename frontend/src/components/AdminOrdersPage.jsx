// src/components/AdminOrdersPage.jsx
import React, { useState } from 'react';
import './AdminOrdersPage.css';

function AdminOrdersPage({ orders, onStatusChange }) {
  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleOrderExpand = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      processing: 'badge-processing',
      shipped: 'badge-shipped',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled'
    };
    return statusMap[status] || 'badge-default';
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

  return (
    <div className="admin-orders-page">
      <div className="page-header">
        <h1 className="page-title">📦 Sipariş Yönetimi</h1>
        <p className="page-subtitle">Siparişleri görüntüleyin ve durumlarını güncelleyin</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kullanıcı</th>
              <th>Email</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="order-row">
                    <td className="td-id">{order.id}</td>
                    <td className="td-name">{order.user_name}</td>
                    <td className="td-email">{order.user_email}</td>
                    <td className="td-amount">
                      {parseFloat(order.total_price).toFixed(2)} ₺
                    </td>
                    <td className="td-status">
                      <select
                        className={`status-select ${getStatusBadgeClass(order.status)}`}
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Beklemede</option>
                        <option value="processing">İşleniyor</option>
                        <option value="shipped">Kargoya Verildi</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </td>
                    <td className="td-date">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="td-actions">
                      <button 
                        className="btn-toggle-details"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                        {expandedOrders.includes(order.id) ? '▼ Gizle' : '▶ Görüntüle'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrders.includes(order.id) && (
                    <tr className="order-details-row">
                      <td colSpan="7">
                        <div className="order-details">
                          <h4>📋 Sipariş Detayları</h4>
                          <div className="order-items">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                  <span className="item-name">{item.product_name}</span>
                                  <span className="item-volume">{item.volume}</span>
                                  <span className="item-quantity">x{item.quantity}</span>
                                  <span className="item-price">
                                    {parseFloat(item.price * item.quantity).toFixed(2)} ₺
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p>Sipariş ürünü bulunamadı</p>
                            )}
                          </div>
                          {order.shipping_address && (
                            <div className="shipping-address">
                              <strong>📍 Teslimat Adresi:</strong>
                              <p>{order.shipping_address}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  Henüz sipariş bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
