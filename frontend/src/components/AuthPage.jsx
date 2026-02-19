// src/components/AuthPage.jsx

import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleRegisterClick = () => {
    setIsActive(true);
    setError('');
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isActive) {
        // Kayıt olma
        if (!name.trim()) {
          setError('İsim gereklidir');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Şifreler eşleşmiyor!');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Şifre en az 6 karakter olmalıdır');
          setLoading(false);
          return;
        }

        const result = await register(name, email, password);
        if (result.success) {
          alert('Kayıt başarılı! Hoş geldiniz.');
          navigate('/');
        } else {
          setError(result.message || 'Kayıt başarısız');
        }
      } else {
        // Giriş yapma
        const result = await login(email, password);
        if (result.success) {
          alert('Giriş başarılı!');
          navigate('/');
        } else {
          setError(result.message || 'Giriş başarısız');
        }
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Hesap Oluştur</h1>
            <span>E-posta adresinizle kayıt olun</span>
            {error && <div className="error-message">{error}</div>}
            <input 
              type="text" 
              placeholder="İsim" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input 
              type="email" 
              placeholder="E-posta" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Şifre (en az 6 karakter)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Şifre Tekrar" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Giriş Yap</h1>
            <span>E-posta ve şifrenizi girin</span>
            {error && <div className="error-message">{error}</div>}
            <input 
              type="email" 
              placeholder="E-posta" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Şifre" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
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