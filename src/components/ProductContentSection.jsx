// src/components/ProductContentSection.jsx

import React from 'react';
import './ProductContentSection.css'; // Stil dosyasını import ediyoruz
import aboutUsImg from '../assets/about-us-img.jpg'; // Aynı görseli tekrar kullanıyoruz

function ProductContentSection() {
  return (
    <section className="product-content-section">
      <h2>Ürün İçeriği</h2>
      <div className="content-wrapper right-image"> {/* Yeni bir sınıf ekledik */}
        <div className="text-container">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed nec sapien eu nisl pharetra hendrerit. Etiam id justo ut sapien lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p>
            Vivamus consectetur mi et erat commodo, in vestibulum libero bibendum. Proin scelerisque, sapien sit amet tincidunt. Maecenas sit amet nisl sed ex viverra.
          </p>
          <p>
            Fusce ac felis et magna scelerisque euismod. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Curabitur vel.
          </p>
        </div>
        <div className="image-container">
          <img src={aboutUsImg} alt="Ürün İçeriği Görseli" className="content-image" />
        </div>
      </div>
    </section>
  );
}

export default ProductContentSection;