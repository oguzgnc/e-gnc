import React from 'react';
import Navbar from './Navbar';
import './LegalPage.css';

function KVKKPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <h1>KVKK Aydınlatma Metni</h1>
        <section>
          <h2>Taslak metin</h2>
          <p>
            Bu alan, kişisel verilerin işlenmesine ilişkin aydınlatma metninin
            işletme ve hukuk danışmanı tarafından hazırlanacak güncel içeriği
            ile doldurulmalıdır.
          </p>
        </section>
        <section>
          <h2>İşlenen veriler ve amaç</h2>
          <p>Buraya işlenen kişisel veri kategorileri, işleme amaçları, hukuki sebepler ve saklama süreleri eklenmelidir.</p>
        </section>
        <section>
          <h2>Başvuru hakları</h2>
          <p>İlgili kişinin başvuru yöntemi ve veri sorumlusu iletişim bilgileri burada açıklanmalıdır.</p>
        </section>
      </main>
    </>
  );
}

export default KVKKPage;
