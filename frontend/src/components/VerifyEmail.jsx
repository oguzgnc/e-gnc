// src/components/VerifyEmail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import './VerifyEmail.css';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Doğrulama bağlantısı eksik veya geçersiz.');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        if (response && response.success) {
          setStatus('success');
          setMessage(response.message || 'E-postanız başarıyla doğrulandı, giriş yapabilirsiniz.');
        } else {
          setStatus('error');
          setMessage(response.message || 'Doğrulama işlemi başarısız oldu.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.');
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="verify-email-wrapper">
      <Navbar />
      <main className="verify-email-page">
        <div className="verify-email-card">
          {status === 'loading' && (
            <>
              <div className="verify-icon-wrapper loading">
                <Loader2 size={40} />
              </div>
              <h1 className="verify-title">E-postanız Doğrulanıyor...</h1>
              <p className="verify-description">
                Lütfen bekleyin, hesabınız aktifleştiriliyor.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verify-icon-wrapper success">
                <CheckCircle size={44} />
              </div>
              <h1 className="verify-title">E-postanız Doğrulandı!</h1>
              <p className="verify-description">
                {message || 'E-postanız başarıyla doğrulandı, şimdi hesabınıza giriş yapabilirsiniz.'}
              </p>
              <Link to="/login" className="btn-verify-action">
                Giriş Yap <ArrowRight size={18} />
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verify-icon-wrapper error">
                <XCircle size={44} />
              </div>
              <h1 className="verify-title">Doğrulama Başarısız</h1>
              <p className="verify-description">
                {message || 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/login" className="btn-verify-action">
                  Giriş Sayfası
                </Link>
                <Link to="/" className="btn-verify-action secondary">
                  Ana Sayfa
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
