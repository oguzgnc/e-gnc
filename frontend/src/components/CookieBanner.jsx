import React, { useEffect, useState } from 'react';
import './CookieBanner.css';

const COOKIE_CONSENT_KEY = 'cookieConsent';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsVisible(consent !== 'accepted' && consent !== 'rejected');
  }, []);

  const saveConsent = (consent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, consent);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-label="Çerez bildirimi">
      <div className="cookie-banner-content">
        <div>
          <h2>Çerez tercihleri</h2>
          <p>
            Sitemizin düzgün çalışması için gerekli çerezleri kullanıyoruz.
            Ayrıntılar için <a href="/kvkk">KVKK metnini</a> inceleyebilirsiniz.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-reject-button"
            onClick={() => saveConsent('rejected')}
          >
            Yalnızca Gerekli Çerezler
          </button>
          <button
            type="button"
            className="cookie-accept-button"
            onClick={() => saveConsent('accepted')}
          >
            Kabul Et
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CookieBanner;
