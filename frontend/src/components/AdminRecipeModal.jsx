// src/components/AdminRecipeModal.jsx
import React, { useState, useEffect } from 'react';
import { ChefHat, Upload, X, Search, Sparkles } from 'lucide-react';
import { productAPI } from '../services/api';
import './AdminRecipeModal.css';

function AdminRecipeModal({ isOpen, onClose, onSave, loading: saving }) {
  const imgBaseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
    : 'http://localhost:5000';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prep_time: '',
    instructions: '',
    imageFile: null,
    image_url: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  // Map of selected productId -> { selected: boolean, quantity: number, unit: string }
  const [selectedIngredients, setSelectedIngredients] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        prep_time: '',
        instructions: '',
        imageFile: null,
        image_url: ''
      });
      setImagePreview('');
      setSelectedIngredients({});
      setProductSearch('');

      // Fetch products
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productAPI.getAllProducts();
      if (data && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Ürünler yüklenirken hata:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
    setImagePreview('');
  };

  const handleToggleProduct = (productId) => {
    setSelectedIngredients(prev => {
      const current = prev[productId];
      if (current && current.selected) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return {
        ...prev,
        [productId]: {
          selected: true,
          quantity: 1,
          unit: 'adet'
        }
      };
    });
  };

  const handleIngredientChange = (productId, field, value) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Lütfen tarif başlığını girin.');
      return;
    }

    if (!formData.instructions.trim()) {
      alert('Lütfen tarifin yapılış talimatlarını girin.');
      return;
    }

    // Format selected ingredients
    const ingredientsArray = Object.entries(selectedIngredients)
      .filter(([_, item]) => item && item.selected)
      .map(([productId, item]) => ({
        product_id: parseInt(productId, 10),
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit || 'adet'
      }));

    // Create FormData
    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('prep_time', formData.prep_time.trim());
    payload.append('instructions', formData.instructions.trim());

    if (formData.imageFile) {
      payload.append('image', formData.imageFile);
    } else if (formData.image_url.trim()) {
      payload.append('image_url', formData.image_url.trim());
    }

    payload.append('ingredients', JSON.stringify(ingredientsArray));

    onSave(payload);
  };

  const filteredProducts = products.filter(product => {
    const q = productSearch.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.category && product.category.toLowerCase().includes(q))
    );
  });

  const selectedCount = Object.values(selectedIngredients).filter(i => i && i.selected).length;

  return (
    <div className="recipe-modal-overlay" onClick={onClose}>
      <div className="recipe-modal-container" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="recipe-modal-header">
          <h2 className="recipe-modal-title">
            <ChefHat size={24} />
            Yeni Tarif Ekle
          </h2>
          <button className="recipe-modal-close-btn" onClick={onClose} title="Kapat">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="recipe-modal-body">
          {/* Başlık ve Süre */}
          <div className="recipe-form-row recipe-form-row-2">
            <div className="recipe-form-group">
              <label className="recipe-form-label">
                Tarif Başlığı <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="recipe-form-input"
                placeholder="Örn: Kayseri Yağlaması, Kaşarlı Sucuklu Tost..."
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="recipe-form-group">
              <label className="recipe-form-label">
                Hazırlama Süresi
              </label>
              <input
                type="text"
                name="prep_time"
                className="recipe-form-input"
                placeholder="Örn: 30 dakika, 45 dk..."
                value={formData.prep_time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Açıklama */}
          <div className="recipe-form-row">
            <div className="recipe-form-group">
              <label className="recipe-form-label">
                Kısa Açıklama / Hikaye
              </label>
              <input
                type="text"
                name="description"
                className="recipe-form-input"
                placeholder="Tarif hakkında kısa, iştah kabartan bir özet..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Tarif Yapımı (Talimatlar) */}
          <div className="recipe-form-row">
            <div className="recipe-form-group">
              <label className="recipe-form-label">
                Tarifin Yapılışı (Talimatlar) <span className="required">*</span>
              </label>
              <textarea
                name="instructions"
                className="recipe-form-textarea"
                placeholder="Adım adım tarifin hazırlanışını yazın..."
                rows={4}
                value={formData.instructions}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Görsel Yükleme */}
          <div className="recipe-form-row">
            <div className="recipe-form-group">
              <label className="recipe-form-label">
                Tarif Görseli
              </label>

              {imagePreview ? (
                <div className="recipe-image-preview-box">
                  <img src={imagePreview} alt="Önizleme" />
                  <button
                    type="button"
                    className="btn-remove-preview"
                    onClick={handleRemoveImage}
                    title="Görseli Kaldır"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="recipe-image-upload-zone">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                  <div className="upload-prompt">
                    <span className="upload-prompt-icon">📸</span>
                    <span>Bilgisayarınızdan fotoğraf seçin veya buraya sürükleyin</span>
                    <span className="upload-prompt-hint">JPG, PNG veya WebP (Maks. 6MB)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dinamik Malzeme / Ürün Seçimi */}
          <div className="recipe-form-row">
            <div className="ingredients-selection-section">
              <div className="ingredients-header">
                <div className="ingredients-title">
                  <span>🛒 Tarif Malzemeleri (Mağaza Ürünleri)</span>
                  {selectedCount > 0 && (
                    <span className="ingredients-badge">{selectedCount} ürün seçildi</span>
                  )}
                </div>

                <div className="ingredients-search-box">
                  <input
                    type="text"
                    className="ingredients-search-input"
                    placeholder="🔍 Ürünlerde ara..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
              </div>

              {loadingProducts ? (
                <div className="no-products-found">Ürünler listeleniyor...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-products-found">
                  {products.length === 0
                    ? 'Henüz mağazada kayıtlı ürün bulunamadı.'
                    : 'Arama kriterine uygun ürün bulunamadı.'}
                </div>
              ) : (
                <div className="products-selection-list">
                  {filteredProducts.map(product => {
                    const isChecked = !!(selectedIngredients[product.id] && selectedIngredients[product.id].selected);
                    const ingredientData = selectedIngredients[product.id] || { quantity: 1, unit: 'adet' };

                    let imgSrc = product.image;
                    if (imgSrc && (imgSrc.startsWith('/uploads') || imgSrc.startsWith('/api/uploads'))) {
                      imgSrc = `${imgBaseUrl}${imgSrc}`;
                    }

                    return (
                      <div
                        key={product.id}
                        className={`product-ingredient-card ${isChecked ? 'selected' : ''}`}
                      >
                        <div
                          className="product-ingredient-left"
                          onClick={() => handleToggleProduct(product.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            className="ingredient-checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleProduct(product.id)}
                            onClick={(e) => e.stopPropagation()}
                          />

                          {imgSrc ? (
                            <img src={imgSrc} alt={product.name} className="ingredient-img" />
                          ) : (
                            <div className="ingredient-img-placeholder">🏷️</div>
                          )}

                          <div className="ingredient-info">
                            <span className="ingredient-name">{product.name}</span>
                            <span className="ingredient-category">{product.category} • ₺{Number(product.price).toFixed(2)}</span>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="product-ingredient-right" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="number"
                              step="0.1"
                              min="0.1"
                              className="ingredient-quantity-input"
                              value={ingredientData.quantity}
                              onChange={(e) => handleIngredientChange(product.id, 'quantity', e.target.value)}
                              placeholder="Miktar"
                              title="Miktar"
                            />
                            <select
                              className="ingredient-unit-select"
                              value={ingredientData.unit}
                              onChange={(e) => handleIngredientChange(product.id, 'unit', e.target.value)}
                            >
                              <option value="adet">adet</option>
                              <option value="gram">gram</option>
                              <option value="kg">kg</option>
                              <option value="paket">paket</option>
                              <option value="dilim">dilim</option>
                              <option value="porsiyon">porsiyon</option>
                              <option value="yemek kaşığı">yemek k.</option>
                              <option value="tatlı kaşığı">tatlı k.</option>
                              <option value="su bardağı">su bardağı</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="recipe-modal-footer">
            <button
              type="button"
              className="btn-recipe-cancel"
              onClick={onClose}
              disabled={saving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-recipe-submit"
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : '✨ Tarifi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRecipeModal;
