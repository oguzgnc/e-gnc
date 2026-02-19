// src/components/ContactSection.jsx

import React from 'react';
import './ContactSection.css'; // Stil dosyası
import { Link } from 'react-router-dom'; // İletişim sayfasına yönlendirmek için

function ContactSection() {
  return (
    <section className="contact-section-home">
      <div className="section-header">
        <h2>Bize Ulaşın</h2>
        <Link to="/contact" className="contact-link">
          İletişim Formu →
        </Link>
      </div>
      <div className="contact-info-grid">
        <div className="info-item">
          <div className="info-icon">📍</div>
          <h3>Adres</h3>
          <p>Konya, Türkiye</p>
        </div>
        <div className="info-item">
          <div className="info-icon">📞</div>
          <h3>Telefon</h3>
          <p>+90 5XX XXX XX XX</p>
        </div>
        <div className="info-item">
          <div className="info-icon">✉️</div>
          <h3>E-posta</h3>
          <p>info@gncsarkuteri.com</p>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;