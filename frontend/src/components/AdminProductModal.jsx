// src/components/AdminProductModal.jsx
import React, { useState, useEffect } from 'react';
import './AdminProductModal.css';

function AdminProductModal({ isOpen, onClose, onSave, product }) {
  const imgBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
    options: {}
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_id: product.product_id || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        image: product.image || '',
        options: product.options || {}
      });
    } else {
      setFormData({
        product_id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        image: '',
        options: {}
      });
    }
  }, [product, isOpen]);

  // Load categories dynamically
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://gncsarkuteri-backend.onrender.com/api' : 'http://localhost:5000/api')}/categories`);
        const data = await res.json();
        if (data && data.categories) {
          setCategories(data.categories.map(c => ({ id: c.slug, name: c.name })));
        }
      } catch (err) {
        console.error('Kategori yüklenemedi:', err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [previewSrc, setPreviewSrc] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, image: '' }));
      setPreviewSrc(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, imageFile: undefined }));
      setPreviewSrc('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün Ekle'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Ürün ID <span className="required">*</span>
              </label>
              <input
                type="text"
                name="product_id"
                className="form-input"
                value={formData.product_id}
                onChange={handleChange}
                placeholder="Örn: sucuk-fermente-500g"
                required
                disabled={product !== null}
              />
              <span className="form-hint">
                Benzersiz ürün kimliği (düzenlemede değiştirilemez)
              </span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Ürün Adı <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ürün adı girin"
                required
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">
                Kategori <span className="required">*</span>
              </label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Fiyat (₺) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Resim Seç</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
              />
              {(previewSrc || formData.image) && (
                <div className="image-preview">
                  <img src={previewSrc || (formData.image && (formData.image.startsWith('/uploads') || formData.image.startsWith('/api/uploads')) ? `${imgBaseUrl}${formData.image}` : formData.image)} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ürün açıklaması girin..."
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-save"
            >
              {product ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductModal;
