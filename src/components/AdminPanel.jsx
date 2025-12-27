// src/components/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Navbar from './Navbar';
import './AdminPanel.css';

function AdminPanel() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin kontrolü
    if (!isLoggedIn || user?.role !== 'admin') {
      alert('Bu sayfaya erişim yetkiniz yok!');
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [isLoggedIn, user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllOrders()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (ordersRes.success) setOrders(ordersRes.orders);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      alert('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const result = await adminAPI.updateUserRole(userId, newRole);
      if (result.success) {
        alert('Kullanıcı rolü güncellendi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Rol güncellenemedi: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
      const result = await adminAPI.deleteUser(userId);
      if (result.success) {
        alert('Kullanıcı silindi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Kullanıcı silinemedi: ' + error.message);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const result = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        alert('Sipariş durumu güncellendi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Sipariş durumu güncellenemedi: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-panel">
          <div className="loading">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-panel">
        <div className="admin-header">
          <h1>🛡️ Admin Paneli</h1>
          <p>Hoş geldiniz, {user?.name}</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Kullanıcılar
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📦 Siparişler
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && stats && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Toplam Kullanıcı</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Toplam Sipariş</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{stats.totalRevenue.toFixed(2)} ₺</h3>
                  <p>Toplam Gelir</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pendingOrders}</h3>
                  <p>Bekleyen Sipariş</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-table">
              <h2>Kullanıcı Yönetimi</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>İsim</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Kayıt Tarihi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === user?.id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user?.id}
                        >
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-table">
              <h2>Sipariş Yönetimi</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kullanıcı</th>
                    <th>Email</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.user_name}</td>
                      <td>{order.user_email}</td>
                      <td>{parseFloat(order.total_price).toFixed(2)} ₺</td>
                      <td>
                        <select 
                          value={order.status} 
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        >
                          <option value="pending">Beklemede</option>
                          <option value="processing">İşleniyor</option>
                          <option value="shipped">Kargoya Verildi</option>
                          <option value="delivered">Teslim Edildi</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
