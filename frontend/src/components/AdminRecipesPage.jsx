// src/components/AdminRecipesPage.jsx
import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Trash2, Clock, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI } from '../services/api';
import AdminRecipeModal from './AdminRecipeModal';
import './AdminRecipesPage.css';

function AdminRecipesPage() {
  const imgBaseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
    : 'http://localhost:5000';

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all recipes on component mount
  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await recipeAPI.getAllRecipes();
      if (data && data.success && Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error('Tarifler yüklenirken hata:', err);
      setError('Tarifler yüklenirken bir sorun oluştu: ' + (err.message || 'Sunucu hatası'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handle recipe deletion
  const handleDeleteRecipe = async (id, title) => {
    const isConfirmed = window.confirm(`"${title || 'Bu tarifi'}" silmek istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    try {
      const result = await recipeAPI.deleteRecipe(id);
      if (result && result.success) {
        toast.success('Tarif başarıyla silindi');
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error(result.message || 'Tarif silinemedi');
      }
    } catch (err) {
      console.error('Tarif silme hatası:', err);
      toast.error('Tarif silinirken hata: ' + (err.message || 'Sunucu hatası'));
    }
  };

  // Handle recipe creation save from modal
  const handleSaveRecipe = async (formData) => {
    setSubmitting(true);
    try {
      const result = await recipeAPI.createRecipe(formData);
      if (result && result.success) {
        toast.success('Yeni tarif başarıyla eklendi!');
        setIsModalOpen(false);
        await fetchRecipes();
      } else {
        toast.error(result.message || 'Tarif eklenemedi');
      }
    } catch (err) {
      console.error('Tarif ekleme hatası:', err);
      toast.error('Tarif eklenirken hata: ' + (err.message || 'Sunucu hatası'));
    } finally {
      setSubmitting(false);
    }
  };

  // Filter recipes based on search
  const filteredRecipes = recipes.filter(recipe => {
    const q = searchTerm.toLowerCase();
    return (
      (recipe.title && recipe.title.toLowerCase().includes(q)) ||
      (recipe.description && recipe.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-recipes-page">
      {/* Page Header */}
      <div className="recipes-page-header">
        <div className="recipes-page-header-left">
          <h1 className="recipes-page-title">
            <ChefHat size={30} color="#00796b" />
            Tarif Yönetimi
          </h1>
          <p className="recipes-page-subtitle">
            Şefin önerileri ve lezzetli yemek tariflerini yönetin, mağaza ürünlerini bağlayın.
          </p>
        </div>

        <button className="btn-add-recipe" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="btn-icon" />
          Yeni Tarif Ekle
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="recipes-error-banner">
          <AlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          {error}
        </div>
      )}

      {/* Recipes Table Card */}
      <div className="recipes-table-card">
        <div className="recipes-table-toolbar">
          <span className="recipes-count">
            Toplam <strong>{recipes.length}</strong> tarif listeleniyor
          </span>

          <div className="recipes-search-bar">
            <span className="recipes-search-icon">🔍</span>
            <input
              type="text"
              className="recipes-search-input"
              placeholder="Tariflerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="recipes-table-wrapper">
          <table className="admin-recipes-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Tarif Başlığı</th>
                <th>Hazırlama Süresi</th>
                <th>Eklenme Tarihi</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="recipes-loading-state">
                    ⏳ Tarifler yükleniyor...
                  </td>
                </tr>
              ) : filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => {
                  let imgSrc = recipe.image_url;
                  if (imgSrc && (imgSrc.startsWith('/uploads') || imgSrc.startsWith('/api/uploads'))) {
                    imgSrc = `${imgBaseUrl}${imgSrc}`;
                  }

                  return (
                    <tr key={recipe.id}>
                      {/* Görsel */}
                      <td className="td-recipe-image">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={recipe.title}
                            className="recipe-thumbnail-img"
                          />
                        ) : (
                          <div className="recipe-no-image">🍲</div>
                        )}
                      </td>

                      {/* Başlık & Açıklama */}
                      <td className="td-recipe-title">
                        <div className="recipe-title-text">{recipe.title}</div>
                        {recipe.description && (
                          <div className="recipe-description-text">{recipe.description}</div>
                        )}
                      </td>

                      {/* Süre */}
                      <td>
                        <span className="recipe-time-badge">
                          <Clock size={13} />
                          {recipe.prep_time || 'Belirtilmedi'}
                        </span>
                      </td>

                      {/* Tarih */}
                      <td className="td-recipe-date">
                        {recipe.created_at
                          ? new Date(recipe.created_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>

                      {/* Sil Butonu */}
                      <td className="td-recipe-actions">
                        <button
                          className="btn-recipe-delete"
                          onClick={() => handleDeleteRecipe(recipe.id, recipe.title)}
                          title="Tarifi Sil"
                        >
                          <Trash2 size={15} />
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="recipes-empty-state">
                    <div className="recipes-empty-icon">🍳</div>
                    <p className="recipes-empty-title">
                      {searchTerm ? 'Aramanıza uygun tarif bulunamadı' : 'Henüz hiç tarif eklenmemiş'}
                    </p>
                    <p className="recipes-empty-desc">
                      {searchTerm
                        ? 'Farklı bir anahtar kelime ile aramayı deneyebilirsiniz.'
                        : 'Yukarıdaki "Yeni Tarif Ekle" butonuna tıklayarak ilk tarifinizi oluşturun.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipe Add Modal */}
      <AdminRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecipe}
        loading={submitting}
      />
    </div>
  );
}

export default AdminRecipesPage;
