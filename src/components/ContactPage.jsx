// src/components/ContactPage.jsx

import React, { useState } from 'react';
import './ContactPage.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { contactAPI } from '../services/api';
import '../components/AboutUsSection.css'; // Mini contact için

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Lütfen en azından isim, email ve mesaj alanlarını doldurun!');
      return;
    }

    setLoading(true);
    try {
      const result = await contactAPI.sendMessage(formData);
      
      if (result.success) {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        alert('Mesaj gönderilemedi: ' + (result.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
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
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Konu (Opsiyonel):</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact-submit-button" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
          </button>
        </form>
        <button className="back-to-home-button" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;