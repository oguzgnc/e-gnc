// src/components/AdminCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import './AdminCategoriesPage.css';

const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://gncsarkuteri-backend.onrender.com/api'
    : 'http://localhost:5000/api');

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      setError('Kategoriler yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewName('');
        await fetchCategories();
      } else {
        setError(data.message || 'Kategori eklenemedi');
      }
    } catch (err) {
      setError('Sunucu hatası: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchCategories();
      } else {
        setError(data.message || 'Kategori silinemedi');
      }
    } catch (err) {
      setError('Sunucu hatası: ' + err.message);
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🗂️ Kategori Yönetimi</h1>
          <p className="page-subtitle">Ürün kategorilerini görüntüleyin ve yönetin</p>
        </div>
      </div>

      {error && <div className="categories-error">{error}</div>}

      <div className="categories-layout">
        {/* Yeni Kategori Formu */}
        <div className="categories-add-card">
          <h2>Yeni Kategori Ekle</h2>
          <form onSubmit={handleAdd} className="categories-form">
            <input
              type="text"
              className="categories-input"
              placeholder="Kategori adı (örn: Süt Ürünleri)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="btn-add-category" disabled={submitting || !newName.trim()}>
              {submitting ? 'Ekleniyor...' : '+ Ekle'}
            </button>
          </form>
          <p className="categories-hint">
            Slug otomatik oluşturulur. Örn: "Süt Ürünleri" → <code>sut-urunleri</code>
          </p>
        </div>

        {/* Mevcut Kategoriler Listesi */}
        <div className="categories-list-card">
          <h2>Mevcut Kategoriler</h2>
          {loading ? (
            <p className="categories-loading">Yükleniyor...</p>
          ) : categories.length === 0 ? (
            <p className="categories-empty">Henüz kategori bulunmamaktadır.</p>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adı</th>
                  <th>Slug</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td className="cat-name">{cat.name}</td>
                    <td><code className="cat-slug">{cat.slug}</code></td>
                    <td>
                      <button
                        className="btn-delete-category"
                        onClick={() => handleDelete(cat.id, cat.name)}
                      >
                        🗑️ Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;
