// src/components/AuthPage.jsx

import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Formun varsayılan gönderimini engelle

    if (isActive) {
      // Kayıt olma mantığı (şimdilik basit bir konsol log)
      if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }
      console.log('Kayıt Olma Girişimi:', { email, password });
      alert('Kayıt başarılı! (Gerçek uygulamada kayıt API\'si kullanılır)');
      setIsActive(false); // Kayıt olduktan sonra giriş ekranına geri dön
    } else {
      // Giriş yapma mantığı
      console.log('Giriş Yapma Girişimi:', { email, password });
      login(email); // Giriş yap
      alert('Giriş başarılı!');
      navigate('/'); // Giriş sonrası ana sayfaya yönlendir
    }
    // Formu temizle
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Hesap Oluştur</h1>
            <span>E-posta adresinizle kayıt olun</span>
            <input type="text" placeholder="İsim" />
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Şifre Tekrar" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button>Kayıt Ol</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Giriş Yap</h1>
            <span>E-posta ve şifrenizi girin</span>
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="#">Şifrenizi mi unuttunuz?</a>
            <button>Giriş Yap</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Tekrar Hoş Geldiniz!</h1>
              <p>Tüm site özelliklerini kullanmak için giriş yapın</p>
              <button className="hidden" id="login" onClick={handleLoginClick}>
                Giriş Yap
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Merhaba!</h1>
              <p>
                Tüm site özelliklerini kullanmak için kayıt olun
              </p>
              <button className="hidden" id="register" onClick={handleRegisterClick}>
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;