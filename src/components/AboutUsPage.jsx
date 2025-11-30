import React from 'react';
import Navbar from './Navbar';
import aboutUsImg from '../assets/about-us-img.jpg';
import './AboutUsSection.css';

function AboutUsPage() {
  return (
    <div>
      <Navbar />
      <div className="about-page-container">
        <div className="about-page-header">
          <h1>Hakkımızda</h1>
          <p className="about-page-subtitle">Doğal, Taze ve Kaliteli Ürünler</p>
        </div>
        
        <div className="about-page-content">
          <div className="about-info-section">
            <div className="info-card">
              <div className="info-icon">🌿</div>
              <h3>Doğal ve Taze</h3>
              <p>
                Gncsarküteri olarak, sofralarınıza en taze ve doğal ürünleri ulaştırmak için tutkuyla çalışıyoruz. 
                Doğadan ilham alan üretim süreçlerimizle, sağlıklı ve lezzetli şarküteri ve süt ürünleri sunuyoruz.
              </p>
            </div>
            
            <div className="info-card featured">
              <div className="info-icon">⭐</div>
              <h3>Kalite Garantisi</h3>
              <p>
                Geleneksel yöntemleri modern yaklaşımlarla birleştirerek, her bir ürünümüzde kalite ve doğallığı garanti ediyoruz. 
                Sizin ve sevdiklerinizin sağlığı bizim önceliğimizdir.
              </p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">❤️</div>
              <h3>Müşteri Memnuniyeti</h3>
              <p>
                Yıllara dayanan tecrübemiz ve işimize duyduğumuz tutku ile her ürünümüzü özenle hazırlıyoruz. 
                Müşteri memnuniyeti bizim için her şeyden önemlidir.
              </p>
            </div>
          </div>
        </div>
      </div>
      
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
  );
}

export default AboutUsPage; 