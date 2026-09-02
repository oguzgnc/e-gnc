import React from 'react';
import './AnnouncementBar.css';

const announcements = [
  '✨ Hoş Geldiniz! Siparişleriniz özenle hazırlanıyor.',
  '🚚 500 TL ve Üzeri Alışverişlerde Kargo Bedava!',
  '🥩 Taze ürünler, güvenli alışveriş ve hızlı teslimat.',
  '🎁 Seçili ürünlerde avantajlı fırsatları kaçırmayın!'
];

function AnnouncementBar() {
  const repeatedAnnouncements = [...announcements, ...announcements];

  return (
    <div className="announcement-bar bg-emerald-800 text-white text-sm py-1.5 overflow-hidden whitespace-nowrap" role="status">
      <div className="announcement-track">
        {repeatedAnnouncements.map((announcement, index) => (
          <span className="announcement-item" key={`${announcement}-${index}`}>
            {announcement}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementBar;
