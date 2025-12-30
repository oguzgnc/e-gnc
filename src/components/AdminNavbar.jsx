// src/components/AdminNavbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar({ activeTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      logout();
      navigate('/');
    }
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: '📊 Dashboard',
      users: '👥 Kullanıcılar',
      orders: '📦 Siparişler',
      products: '🏷️ Ürünler'
    };
    return titles[activeTab] || 'Admin Paneli';
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="navbar-left">
          <button className="home-btn" onClick={handleGoToHome} title="Ana Sayfaya Git">
            <span className="home-icon">🏠</span>
          </button>
          <div className="navbar-divider"></div>
          <span className="navbar-page-title">{getPageTitle()}</span>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">{user?.role || 'admin'}</span>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">↗</span>
            <span className="logout-text">Çıkış</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
