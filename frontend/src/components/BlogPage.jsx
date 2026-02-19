// src/components/BlogPage.jsx

import React from 'react';
import './BlogPage.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../components/AboutUsSection.css'; // Mini contact için
import sutUrunleriImg from '../assets/süt-ürünleri.webp';
import sarkuteriImg from '../assets/sarkuteri.webp';
import gubreImg from '../assets/gubre.jpg';
import baharatlarImg from '../assets/baharatlar.webp';

// Blog gönderileri için örnek veriler
const blogPosts = [
  {
    id: 1,
    title: 'Süt Ürünlerinin Faydaları',
    date: '15 Haziran 2024',
    excerpt: 'Süt ve süt ürünleri, kemik sağlığı için önemli kalsiyum ve D vitamini içerir. Aynı zamanda...',
    image: sutUrunleriImg
  },
  {
    id: 2,
    title: 'Şarküteri Dünyasına Yolculuk',
    date: '10 Haziran 2024',
    excerpt: 'Geleneksel şarküteri ürünleri, sofralarımıza lezzet katan özel yiyeceklerdir. Sucuk, salam ve pastırma...',
    image: sarkuteriImg
  },
  {
    id: 3,
    title: 'Tarım ve Gübrelemenin Önemi',
    date: '5 Haziran 2024',
    excerpt: 'Sağlıklı topraklar ve verimli mahsuller için doğru gübreleme kritik öneme sahiptir. Organik ve kimyasal gübre...',
    image: gubreImg
  },
  {
    id: 4,
    title: 'Baharatların Sofralardaki Yeri',
    date: '1 Haziran 2024',
    excerpt: 'Yemeklere lezzet katan baharatlar, aynı zamanda sağlık açısından da faydalıdır. Kimyon, kekik, pul biber...',
    image: baharatlarImg
  },
  
];

function BlogPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="blog-page">
        <h2>Blogumuz</h2>
        <div className="blog-posts-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-post-card">
            <img src={post.image} alt={post.title} className="blog-post-image" />
            <div className="blog-post-content">
              <h3>{post.title}</h3>
              <p className="blog-post-date">{post.date}</p>
              <p className="blog-post-excerpt">{post.excerpt}</p>
              <button className="read-more-blog-button" onClick={() => alert('Daha Fazla Oku - Blog Yazısı Detayı')}>
                Devamını Oku
              </button>
            </div>
          </div>
        ))}
        </div>
        <button className="back-to-home-button" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        
        {/* Küçük İletişim Bölümü */}
        <div className="mini-contact-section">
          <h3>İletişim</h3>
          <div className="mini-contact-info">
            <span>📍 Konya, Türkiye</span>
            <span>📞 +90 5XX XXX XX XX</span>
            <span>✉️ info@gncsarkuteri.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;