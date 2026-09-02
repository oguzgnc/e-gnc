import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookHeart, LogOut, Mail, MapPin, Plus, Settings, ShieldCheck, Smartphone, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { favoriteAPI } from '../services/api';
import RecipeCard from './RecipeCard';
import './ProfilePage.css';
import './RecipesPage.css';

function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(new Set());

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (activeSection !== 'favorites' || !isLoggedIn) return;

    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      setFavoritesError('');
      try {
        const response = await favoriteAPI.getFavorites();
        setFavoriteRecipes(response.favorites || []);
      } catch (error) {
        setFavoritesError(error.message || 'Favoriler yüklenirken bir hata oluştu.');
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [activeSection, isLoggedIn]);

  if (authLoading || !isLoggedIn) {
    return <div className="profile-page-loading">Hesabınız yükleniyor...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  const toggleFavorite = async (recipeId) => {
    if (favoriteActionLoading.has(recipeId)) return;
    setFavoriteActionLoading(previousLoading => new Set(previousLoading).add(recipeId));

    try {
      const response = await favoriteAPI.toggleFavorite(recipeId);
      if (!response.isFavorite) {
        setFavoriteRecipes(previousRecipes => previousRecipes.filter(recipe => recipe.id !== recipeId));
      }
    } catch (error) {
      toast.error(error.message || 'Favori güncellenemedi.');
    } finally {
      setFavoriteActionLoading(previousLoading => {
        const nextLoading = new Set(previousLoading);
        nextLoading.delete(recipeId);
        return nextLoading;
      });
    }
  };

  return (
    <div className="profile-page">
      <main className="profile-shell">
        <header className="profile-heading">
          <span className="profile-kicker"><ShieldCheck size={17} /> Güvenli müşteri alanı</span>
          <h1>Hesabım</h1>
          <p>Siparişlerinizi ve hesap bilgilerinizi tek bir yerden yönetin.</p>
        </header>

        <div className="profile-layout">
          <aside className="profile-sidebar" aria-label="Hesap menüsü">
            <div className="profile-user-summary">
              <div className="profile-avatar"><UserRound size={25} /></div>
              <div>
                <strong>{user?.name || 'Değerli müşterimiz'}</strong>
                <span>{user?.email}</span>
              </div>
            </div>

            <nav className="profile-menu">
              <button
                className={activeSection === 'profile' ? 'profile-menu-item active' : 'profile-menu-item'}
                onClick={() => setActiveSection('profile')}
              >
                <UserRound size={18} /> Profil Bilgilerim
              </button>
              <button
                className={activeSection === 'address' ? 'profile-menu-item active' : 'profile-menu-item'}
                onClick={() => setActiveSection('address')}
              >
                <MapPin size={18} /> Adres Defterim
              </button>
              <button
                className={activeSection === 'favorites' ? 'profile-menu-item active' : 'profile-menu-item'}
                onClick={() => setActiveSection('favorites')}
              >
                <BookHeart size={18} /> Favori Tariflerim
              </button>
              <button
                className={activeSection === 'settings' ? 'profile-menu-item active' : 'profile-menu-item'}
                onClick={() => setActiveSection('settings')}
              >
                <Settings size={18} /> Ayarlar
              </button>
              <button className="profile-menu-item logout" onClick={handleLogout}>
                <LogOut size={18} /> Çıkış Yap
              </button>
            </nav>
          </aside>

          <section className="profile-content">
            {activeSection === 'profile' && (
              <div className="profile-panel">
                <div className="profile-panel-header">
                  <span className="profile-panel-icon"><UserRound size={20} /></span>
                  <div>
                    <h2>Profil Bilgilerim</h2>
                    <p>Hesabınıza ait temel bilgiler</p>
                  </div>
                </div>
                <div className="profile-info-grid">
                  <div className="profile-info-item"><span>Ad Soyad</span><strong>{user?.name || '-'}</strong></div>
                  <div className="profile-info-item"><span>E-posta</span><strong>{user?.email || '-'}</strong></div>
                  <div className="profile-info-item"><span>Hesap Türü</span><strong>{user?.role === 'admin' ? 'Yönetici' : 'Müşteri'}</strong></div>
                </div>
              </div>
            )}

            {activeSection === 'address' && (
              <div className="profile-panel">
                <div className="profile-panel-header">
                  <span className="profile-panel-icon"><MapPin size={20} /></span>
                  <div>
                    <h2>Adres Defterim</h2>
                    <p>Teslimat adreslerinizi kolayca yönetin</p>
                  </div>
                </div>
                <div className="profile-panel-toolbar">
                  <p className="profile-message">Siparişleriniz için kayıtlı adresleriniz</p>
                  <button className="profile-primary-button"><Plus size={17} /> Yeni Adres Ekle</button>
                </div>
                <div className="profile-address-card">
                  <div className="profile-address-icon"><MapPin size={21} /></div>
                  <div>
                    <strong>Ev Adresi</strong>
                    <p>Meram, Konya<br />Türkiye</p>
                  </div>
                  <span className="profile-address-label">Varsayılan</span>
                </div>
              </div>
            )}

            {activeSection === 'favorites' && (
              <div className="profile-panel">
                <div className="profile-panel-header">
                  <span className="profile-panel-icon"><BookHeart size={20} /></span>
                  <div>
                    <h2>Favori Tariflerim</h2>
                    <p>Beğendiğiniz tarifleri burada bulabilirsiniz</p>
                  </div>
                </div>
                {favoritesLoading && <p className="profile-message">Favorileriniz yükleniyor...</p>}
                {favoritesError && <p className="profile-message error">{favoritesError}</p>}
                {!favoritesLoading && !favoritesError && favoriteRecipes.length === 0 && (
                  <div className="profile-empty-panel">
                    <BookHeart size={48} />
                    <h2>Favori Tariflerim</h2>
                    <p>Henüz favori tarifiniz bulunmuyor, hemen tarifleri keşfedin!</p>
                    <button className="profile-primary-button" onClick={() => navigate('/tarifler')}>Tarifleri Keşfet</button>
                  </div>
                )}
                {!favoritesLoading && !favoritesError && favoriteRecipes.length > 0 && (
                  <div className="recipes-grid profile-favorites-grid">
                    {favoriteRecipes.map(recipe => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isFavorite
                        isFavoriteLoading={favoriteActionLoading.has(recipe.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="profile-panel">
                <div className="profile-panel-header">
                  <span className="profile-panel-icon"><Settings size={20} /></span>
                  <div>
                    <h2>Ayarlar</h2>
                    <p>Bildirim tercihlerinizi yönetin</p>
                  </div>
                </div>
                <div className="profile-settings-list">
                  <label className="profile-setting-row">
                    <span className="profile-setting-icon"><Mail size={18} /></span>
                    <span className="profile-setting-copy"><strong>E-posta bildirimleri almak istiyorum</strong><small>Önemli güncellemeleri e-posta ile alın</small></span>
                    <input type="checkbox" checked={emailNotifications} onChange={(event) => setEmailNotifications(event.target.checked)} />
                  </label>
                  <label className="profile-setting-row">
                    <span className="profile-setting-icon"><Smartphone size={18} /></span>
                    <span className="profile-setting-copy"><strong>SMS ile kampanyalardan haberdar olmak istiyorum</strong><small>Fırsatları ve kampanyaları kaçırmayın</small></span>
                    <input type="checkbox" checked={smsNotifications} onChange={(event) => setSmsNotifications(event.target.checked)} />
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
