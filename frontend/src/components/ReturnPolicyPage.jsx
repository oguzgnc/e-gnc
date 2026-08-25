import React from 'react';
import Navbar from './Navbar';
import './LegalPage.css';

function ReturnPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <h1>İade ve Cayma Koşulları</h1>
        <section>
          <h2>Taslak metin</h2>
          <p>Bu alan, iade ve cayma sürecine ilişkin işletmenize özel güncel politika ile doldurulmalıdır.</p>
        </section>
        <section>
          <h2>Cayma hakkı</h2>
          <p>Cayma süresi, istisnalar, bildirim yöntemi ve iade kargo süreci burada açıkça belirtilmelidir.</p>
        </section>
        <section>
          <h2>İade süreci</h2>
          <p>İade talebi için gereken bilgiler, inceleme süresi ve ücret iadesinin nasıl yapılacağı burada açıklanmalıdır.</p>
        </section>
      </main>
    </>
  );
}

export default ReturnPolicyPage;
