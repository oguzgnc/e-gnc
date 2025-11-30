// src/components/BlogSection.jsx

import React from 'react';
import './BlogSection.css'; // Stil dosyası
import { Link } from 'react-router-dom'; // Blog sayfasına yönlendirmek için

// Blog gönderileri için örnek veriler (ilk 3 tanesini alalım)
// Bu veriler normalde merkezi bir yerden gelmeli (ProductDetailPage'deki gibi)
const blogPostsPreview = [
  {
    id: 1,
    title: 'Süt Ürünlerinin Faydaları',
    date: '15 Haziran 2024',
    excerpt: 'Süt ve süt ürünleri, kemik sağlığı için önemli kalsiyum ve D vitamini içerir.',
    image: 'https://via.placeholder.com/300x200/b0e0e6/fff?text=S%C3%BCt' 
  },
  {
    id: 2,
    title: 'Şarküteri Dünyasına Yolculuk',
    date: '10 Haziran 2024',
    excerpt: 'Geleneksel şarküteri ürünleri, sofralarımıza lezzet katan özel yiyeceklerdir.',
    image: 'https://via.placeholder.com/300x200/ffdab9/fff?text=%C5%9Eark%C3%BCteri' 
  },
  {
    id: 3,
    title: 'Tarım ve Gübrelemenin Önemi',
    date: '5 Haziran 2024',
    excerpt: 'Sağlıklı topraklar ve verimli mahsuller için doğru gübreleme kritik öneme sahiptir.',
    image: 'https://via.placeholder.com/300x200/c0d8e4/fff?text=Tarla' 
  },
];

function BlogSection() {
  return (
    <section className="blog-section-home">
      <div className="section-header">
        <h2>Blog</h2>
        <Link to="/blog" className="view-all-link">
          Tümünü Görüntüle →
        </Link>
      </div>
      <div className="blog-posts-preview-grid">
        {blogPostsPreview.map((post, index) => (
          <div key={post.id} className={`blog-post-preview-card ${index === 1 ? 'featured' : ''}`}>
            <img src={post.image} alt={post.title} className="blog-post-preview-image" />
            <div className="blog-post-preview-content">
              <h3>{post.title}</h3>
              <p className="blog-post-preview-date">{post.date}</p>
              <p className="blog-post-preview-excerpt">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogSection;