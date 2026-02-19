// src/components/AdminDashboard.jsx
import React from 'react';
import './AdminDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard({ stats }) {
  const statsCards = [
    {
      icon: '👥',
      title: 'Toplam Kullanıcı',
      value: stats?.totalUsers || 0,
      bgColor: '#4CAF50'
    },
    {
      icon: '📦',
      title: 'Toplam Sipariş',
      value: stats?.totalOrders || 0,
      bgColor: '#2196F3'
    },
    {
      icon: '💰',
      title: 'Toplam Gelir',
      value: `${(stats?.totalRevenue || 0).toFixed(2)} ₺`,
      bgColor: '#FF6F00'
    },
    {
      icon: '⏳',
      title: 'Bekleyen Sipariş',
      value: stats?.pendingOrders || 0,
      bgColor: '#FFC107'
    }
  ];

  // Gerçek verilere dayalı grafik verileri
  const totalOrders = stats?.totalOrders || 0;
  const pendingOrders = stats?.pendingOrders || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  // Gelir trendi - son 6 ay (örnek veri, isterseniz backend'den alınabilir)
  const avgMonthlyRevenue = totalRevenue / 6;
  const revenueData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Aylık Gelir (₺)',
        data: [
          avgMonthlyRevenue * 0.6,
          avgMonthlyRevenue * 0.8,
          avgMonthlyRevenue * 0.7,
          avgMonthlyRevenue * 1.1,
          avgMonthlyRevenue * 0.9,
          avgMonthlyRevenue * 1.4
        ].map(v => Math.round(v)),
        borderColor: '#00796b',
        backgroundColor: 'rgba(0, 121, 107, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Sipariş durumu - gerçek verilerle
  const ordersByStatus = stats?.ordersByStatus || {};
  const orderStatusData = {
    labels: ['Tamamlandı', 'İşlemde', 'Kargoda', 'Beklemede', 'İptal'],
    datasets: [
      {
        data: [
          ordersByStatus.delivered || 0,
          ordersByStatus.processing || 0,
          ordersByStatus.shipped || 0,
          ordersByStatus.pending || 0,
          ordersByStatus.cancelled || 0
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#FFC107', '#F44336'],
        borderWidth: 0,
      },
    ],
  };

  // Kategori satışları - gerçek verilerden
  const categorySales = stats?.categorySales || {};
  const categorySalesData = {
    labels: ['Sucuk', 'Sosis', 'Salam', 'Pastırma', 'Kavurma', 'Jambon'],
    datasets: [
      {
        label: 'Satış Adedi',
        data: [
          categorySales.sucuk || 0,
          categorySales.sosis || 0,
          categorySales.salam || 0,
          categorySales.pastırma || categorySales.pastirma || 0,
          categorySales.kavurma || 0,
          categorySales.jambon || 0
        ],
        backgroundColor: '#00796b',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Dashboard</h1>
        <p className="dashboard-subtitle">İşletmenizin genel performans özeti</p>
      </div>

      <div className="dashboard-stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className="stat-card-modern">
            <div className="stat-card-icon" style={{ backgroundColor: card.bgColor }}>
              {card.icon}
            </div>
            <div className="stat-card-info">
              <h3 className="stat-card-value">{card.value}</h3>
              <p className="stat-card-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">📈 Son Aktiviteler</h2>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <p className="activity-text">Yeni sipariş alındı</p>
              <span className="activity-time">5 dakika önce</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">👤</div>
            <div className="activity-content">
              <p className="activity-text">Yeni kullanıcı kaydı</p>
              <span className="activity-time">15 dakika önce</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">📦</div>
            <div className="activity-content">
              <p className="activity-text">Ürün stoku güncellendi</p>
              <span className="activity-time">1 saat önce</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="charts-grid">
        {/* Gelir Trendi */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">💰 Gelir Trendi</h3>
            <span className="chart-subtitle">Son 6 ay</span>
          </div>
          <div className="chart-container">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Kategori Satışları */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">📊 Kategori Satışları</h3>
            <span className="chart-subtitle">Ürün kategorilerine göre</span>
          </div>
          <div className="chart-container">
            <Bar data={categorySalesData} options={chartOptions} />
          </div>
        </div>

        {/* Sipariş Durumları */}
        <div className="chart-card chart-card-small">
          <div className="chart-header">
            <h3 className="chart-title">🎯 Sipariş Durumları</h3>
            <span className="chart-subtitle">Genel dağılım</span>
          </div>
          <div className="chart-container chart-container-small">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
