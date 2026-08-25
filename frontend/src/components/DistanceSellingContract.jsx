import React from 'react';
import Navbar from './Navbar';
import './LegalPage.css';

function DistanceSellingContract() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <h1>GNChol Mesafeli Satış Sözleşmesi</h1>
        <section>
          <h2>Taslak metin</h2>
          <p>Bu alan, ürün, satıcı, teslimat, ödeme ve cayma koşullarını içeren sözleşme metniyle doldurulmalıdır.</p>
        </section>
        <section>
          <h2>Taraflar</h2>
          <p>Satıcının ticari unvanı, adresi, iletişim bilgileri ve alıcının sipariş sırasında verdiği bilgiler burada yer almalıdır.</p>
        </section>
        <section>
          <h2>Sipariş ve teslimat</h2>
          <p>Ürün özellikleri, toplam bedel, ödeme yöntemi, teslimat süresi ve cayma hakkına ilişkin güncel hükümler burada açıklanmalıdır.</p>
        </section>
      </main>
    </>
  );
}

export default DistanceSellingContract;
