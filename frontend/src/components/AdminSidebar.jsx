// src/components/AdminSidebar.jsx
import React from 'react';
import './AdminSidebar.css';
import gncsarkuteriLogo from '../assets/gncsarkuteri-logo.png';

function AdminSidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Kullanıcılar', icon: '👥' },
    { id: 'orders', label: 'Siparişler', icon: '📦' },
    { id: 'products', label: 'Ürünler', icon: '🏷️' },
    { id: 'categories', label: 'Kategoriler', icon: '🗂️' },
    { id: 'messages', label: 'Mesajlar', icon: '💬' }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <img src={gncsarkuteriLogo} alt="GNC Şarküteri" className="sidebar-logo" />
        <p className="sidebar-subtitle">Admin Paneli</p>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Stats Summary */}
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="stats-item">
            <span className="stats-label">Sistem Durumu</span>
            <span className="stats-value online">● Aktif</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
