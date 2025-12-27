// src/components/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI } from '../services/api';
import Navbar from './Navbar';
import './AdminPanel.css';

function AdminPanel() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    product_id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
    options: []
  });

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
      const [statsRes, usersRes, ordersRes, productsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllOrders(),
        productAPI.getAllProducts()
      ]);

      console.log('Stats Response:', statsRes);
      console.log('Users Response:', usersRes);
      console.log('Orders Response:', ordersRes);
      console.log('Products Response:', productsRes);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (productsRes.success) setProducts(productsRes.products);
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = editingProduct 
        ? await productAPI.updateProduct(editingProduct.id, productForm)
        : await productAPI.createProduct(productForm);
      
      if (result.success) {
        alert(editingProduct ? 'Ürün güncellendi' : 'Ürün eklendi');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          product_id: '',
          name: '',
          description: '',
          category: '',
          price: '',
          image: '',
          options: {}
        });
        loadDashboardData();
      }
    } catch (error) {
      alert('İşlem başarısız: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      options: product.options || {}
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const result = await productAPI.deleteProduct(productId);
      if (result.success) {
        alert('Ürün silindi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Ürün silinemedi: ' + error.message);
    }
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      product_id: '',
      name: '',
      description: '',
      category: '',
      price: '',
      image: '',
      options: {}
    });
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
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            🏷️ Ürünler
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

          {activeTab === 'products' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Ürün Yönetimi</h2>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                  }}
                >
                  + Yeni Ürün Ekle
                </button>
              </div>

              {showProductForm && (
                <div className="product-form-overlay">
                  <div className="product-form-container">
                    <div className="form-header">
                      <h3>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                      <button className="close-btn" onClick={handleCancelProductForm}>×</button>
                    </div>
                    
                    <form onSubmit={handleProductSubmit} className="product-form">
                      <div className="form-group">
                        <label>Ürün ID *</label>
                        <input
                          type="text"
                          value={productForm.product_id}
                          onChange={(e) => setProductForm({...productForm, product_id: e.target.value})}
                          placeholder="Benzersiz ürün ID'si (örn: sucuk-fermente-500g)"
                          required
                          disabled={editingProduct}
                        />
                      </div>

                      <div className="form-group">
                        <label>Ürün Adı *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          placeholder="Ürün adı"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Kategori *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="sucuk">Sucuk</option>
                          <option value="sosis">Sosis</option>
                          <option value="salam">Salam</option>
                          <option value="pastirma">Pastırma</option>
                          <option value="kavurma">Kavurma</option>
                          <option value="jambon">Jambon</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Fiyat (₺) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Resim URL</label>
                        <input
                          type="text"
                          value={productForm.image}
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                          placeholder="https://example.com/resim.jpg"
                        />
                      </div>

                      <div className="form-group">
                        <label>Açıklama</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          placeholder="Ürün açıklaması"
                          rows="4"
                        />
                      </div>

                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelProductForm}>
                          İptal
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                          {loading ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Ekle')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ürün ID</th>
                    <th>Resim</th>
                    <th>Ürün Adı</th>
                    <th>Kategori</th>
                    <th>Fiyat</th>
                    <th>Tarih</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.product_id}</td>
                      <td>
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="product-thumbnail" />
                        ) : (
                          <div className="no-image">Resim Yok</div>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>{product.price} ₺</td>
                      <td>{new Date(product.created_at).toLocaleDateString('tr-TR')}</td>
                      <td className="actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ Düzenle
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteProduct(product.id)}
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
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
