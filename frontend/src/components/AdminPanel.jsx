// src/components/AdminPanel.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI, contactAPI } from '../services/api';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import AdminDashboard from './AdminDashboard';
import AdminUsersPage from './AdminUsersPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminProductsPage from './AdminProductsPage';
import AdminContactPage from './AdminContactPage';
import AdminCategoriesPage from './AdminCategoriesPage';
import AdminProductModal from './AdminProductModal';
import './AdminPanel.css';

function AdminPanel() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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
      const [statsRes, usersRes, ordersRes, productsRes, messagesRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllOrders(),
        productAPI.getAllProducts(),
        contactAPI.getAllMessages().catch(err => {
          console.error('Messages API error:', err);
          return { success: false, messages: [] };
        })
      ]);

      console.log('Stats Response:', statsRes);
      console.log('Users Response:', usersRes);
      console.log('Orders Response:', ordersRes);
      console.log('Products Response:', productsRes);
      console.log('Messages Response:', messagesRes);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (productsRes.success) setProducts(productsRes.products);
      if (messagesRes && messagesRes.success) setMessages(messagesRes.messages);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      alert('Veriler yüklenirken bir hata oluştu: ' + error.message);
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

  const handleProductSubmit = async (formData) => {
    setLoading(true);
    
    try {
      // Normalize options: ensure it's an array. If empty or invalid, create a default option using price.
      const normalized = { ...formData };
      try {
        if (typeof normalized.options === 'string') {
          normalized.options = JSON.parse(normalized.options || '[]');
        }
      } catch (e) {
        normalized.options = [];
      }

      if (!Array.isArray(normalized.options)) {
        // If it's an object with keys, wrap as single option; otherwise fallback to default option
        if (normalized.options && typeof normalized.options === 'object' && Object.keys(normalized.options).length > 0) {
          normalized.options = [normalized.options];
        } else {
          normalized.options = [{ volume: 'Standart', price: Number(normalized.price) || 0 }];
        }
      }

      let result;
      // If an image file was selected, send as FormData
      if (normalized.imageFile) {
        const fd = new FormData();
        // Ensure product_id is present (if editing and product_id not in form, use existing product.product_id or id)
        const pid = normalized.product_id || (editingProduct && (editingProduct.product_id || editingProduct.id)) || '';
        fd.append('product_id', pid);
        fd.append('name', normalized.name || '');
        fd.append('description', normalized.description || '');
        fd.append('category', normalized.category || '');
        fd.append('price', String(normalized.price || '0'));
        fd.append('options', JSON.stringify(normalized.options || []));
        fd.append('image', normalized.imageFile);

        // Debug: log FormData entries
        for (const pair of fd.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        result = editingProduct
          ? await productAPI.updateProduct(editingProduct.id, fd)
          : await productAPI.createProduct(fd);
      } else {
        // Ensure product_id set when editing even if no file
        if (editingProduct && !normalized.product_id) {
          normalized.product_id = editingProduct.product_id || editingProduct.id || '';
        }
        result = editingProduct 
          ? await productAPI.updateProduct(editingProduct.id, normalized)
          : await productAPI.createProduct(normalized);
      }
      
      if (result.success) {
        alert(editingProduct ? 'Ürün güncellendi' : 'Ürün eklendi');
        setShowProductForm(false);
        setEditingProduct(null);
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

  const handleToggleStock = async (productId, inStock) => {
    try {
      const result = await productAPI.toggleStock(productId, inStock);
      if (result.success) {
        alert(inStock ? 'Ürün stoğa alındı' : 'Ürün stoktan çıkarıldı');
        loadDashboardData();
      }
    } catch (error) {
      alert('Stok durumu güncellenemedi: ' + error.message);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await contactAPI.markAsRead(messageId);
      if (result.success) {
        alert('Mesaj okundu olarak işaretlendi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Mesaj güncellenemedi: ' + error.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;

    try {
      const result = await contactAPI.deleteMessage(messageId);
      if (result.success) {
        alert('Mesaj silindi');
        loadDashboardData();
      }
    } catch (error) {
      alert('Mesaj silinemedi: ' + error.message);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleCloseProductModal = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="admin-main">
          <AdminNavbar />
          <div className="admin-content">
            <div className="loading">Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="admin-main">
        <button className="admin-back-btn" onClick={() => window.location.href = '/'} title="Ana Sayfaya Dön">
          <span>←</span>
        </button>
        <AdminNavbar />
        
        <div className="admin-content">
          {activeTab === 'dashboard' && <AdminDashboard stats={stats} />}
          
          {activeTab === 'users' && (
            <AdminUsersPage
              users={users}
              onRoleChange={handleRoleChange}
              onDeleteUser={handleDeleteUser}
            />
          )}
          
          {activeTab === 'orders' && (
            <AdminOrdersPage
              orders={orders}
              onStatusChange={handleOrderStatusChange}
            />
          )}
          
          {activeTab === 'products' && (
            <AdminProductsPage
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleStock={handleToggleStock}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesPage />
          )}

          {activeTab === 'messages' && (
            <AdminContactPage
              messages={messages}
              onMarkAsRead={handleMarkAsRead}
              onDeleteMessage={handleDeleteMessage}
            />
          )}
        </div>

        <footer className="admin-footer">
          <p>© 2024 GNC Şarküteri - Tüm hakları saklıdır</p>
        </footer>
      </div>

      <AdminProductModal
        isOpen={showProductForm}
        onClose={handleCloseProductModal}
        onSave={handleProductSubmit}
        product={editingProduct}
      />
    </div>
  );
}

export default AdminPanel;
