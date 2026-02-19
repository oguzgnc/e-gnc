// src/components/AdminNavbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
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

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="navbar-right">
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
