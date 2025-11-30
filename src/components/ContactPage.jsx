// src/components/ContactPage.jsx

import React, { useState } from 'react';
import './ContactPage.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../components/AboutUsSection.css'; // Mini contact için

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '' // Mesaj alanı da ekleyelim
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basit doğrulama
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    // Form verilerini konsola yazdır (gerçek uygulamada bir API'ye gönderilir)
    console.log('İletişim Formu Verileri:', formData);
    alert('Mesajınız başarıyla gönderildi! Teşekkür ederiz.');
    // Formu temizle
    setFormData({ name: '', email: '', phone: '', message: '' });
    // İsteğe bağlı: Ana sayfaya yönlendir
    // navigate('/'); 
  };

  return (
    <div>
      <Navbar />
      <div className="contact-page">
        <div className="contact-card">
        <h2>Bize Ulaşın</h2>
        <p className="contact-description">Sorularınız, görüşleriniz veya önerileriniz için aşağıdaki formu doldurarak bize ulaşabilirsiniz.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Adınız Soyadınız:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta Adresiniz:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon Numaranız:</label>
            <input
              type="tel" // Telefon numarası için tel tipi
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız:</label>
            <textarea
              id="message"
              name="message"
              rows="5" // Metin kutusunun yüksekliği
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact-submit-button">Mesajı Gönder</button>
        </form>
        <button className="back-to-home-button" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;