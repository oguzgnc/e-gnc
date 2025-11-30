// src/components/AboutUsSection.jsx

import React from 'react';
import './AboutUsSection.css'; // Stil dosyasını import ediyoruz

// ! Hakkımızda görselini import ediyoruz - Artık kullanılmayacak !
// import aboutUsImg from '../assets/about-us-img.jpg'; 


function AboutUsSection() {
  return (
    <section className="about-us-section">
      {/* <h2>Hakkımızda</h2> - Kaldırıldı */}
      <div className="about-content">
        {/* <div className="about-image-container"> - Kaldırıldı */}
        {/*   <img src={aboutUsImg} alt="gncsarküteri Hakkımızda" className="about-image" /> */}
        {/* </div> */}
        <div className="about-text-container">
          <p>
            Gncsarküteri olarak, sofralarınıza en taze ve doğal ürünleri ulaştırmak için tutkuyla çalışıyoruz. Doğadan ilham alan üretim süreçlerimizle, sağlıklı ve lezzetli şarküteri ve süt ürünleri sunuyoruz.
          </p>
          <p>
            Geleneksel yöntemleri modern yaklaşımlarla birleştirerek, her bir ürünümüzde kalite ve doğallığı garanti ediyoruz. Sizin ve sevdiklerinizin sağlığı bizim önceliğimizdir.
          </p>
          {/* İsteğe bağlı olarak daha fazla yazı eklenebilir - azaltıldı */}
          {/* <button className="read-more-button">Daha Fazlasını Oku</button> */}
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;