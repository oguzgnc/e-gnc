import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChefHat, Clock3, Heart, ShoppingBasket, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { favoriteAPI, recipeAPI } from '../services/api';
import Navbar from './Navbar';
import './RecipeDetailPage.css';

const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5000';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return imageUrl.startsWith('/uploads') || imageUrl.startsWith('/api/uploads')
    ? `${API_ORIGIN}${imageUrl}`
    : imageUrl;
};

const getProductOption = (product) => {
  let options = product.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch {
      options = [];
    }
  }
  if (!Array.isArray(options)) options = options ? [options] : [];
  return options[0] || { volume: 'Standart', price: product.price || 0 };
};

function RecipeDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeAPI.getRecipeById(id);
        setRecipe(response.recipe);
        const nextIngredients = response.ingredients || [];
        setIngredients(nextIngredients);
        setSelectedIngredients(nextIngredients.map(product => product.id));

        if (sessionStorage.getItem('token')) {
          try {
            const favoritesResponse = await favoriteAPI.getFavorites();
            setIsFavorite((favoritesResponse.favorites || []).some(favorite => favorite.id === response.recipe.id));
          } catch (favoriteError) {
            console.error('Tarif favori durumu yüklenemedi:', favoriteError);
          }
        }
      } catch (fetchError) {
        console.error('Tarif detayı yüklenemedi:', fetchError);
        setError(fetchError.message || 'Tarif detayı yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const toggleIngredient = (ingredientId) => {
    setSelectedIngredients(previousSelected => (
      previousSelected.includes(ingredientId)
        ? previousSelected.filter(id => id !== ingredientId)
        : [...previousSelected, ingredientId]
    ));
  };

  const handleAddSelectedToCart = () => {
    if (isAdding) return;

    const selectedProducts = ingredients.filter(product => selectedIngredients.includes(product.id));
    if (selectedProducts.length === 0) return;

    setIsAdding(true);
    try {
      selectedProducts.forEach((product) => {
        addToCart(product, getProductOption(product), 1);
      });
      toast.success('Seçili malzemeler başarıyla sepete eklendi! 🍳');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleFavorite = async () => {
    if (isFavoriteLoading) return;
    setIsFavoriteLoading(true);

    try {
      const response = await favoriteAPI.toggleFavorite(recipe.id);
      setIsFavorite(response.isFavorite);
      toast.success(response.isFavorite ? 'Tarif favorilere eklendi!' : 'Tarif favorilerden çıkarıldı.');
    } catch (toggleError) {
      toast.error(toggleError.message || 'Favori güncellenemedi.');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const instructionSteps = (recipe?.instructions || 'Hazırlama adımları yakında eklenecek.')
    .split('.')
    .map(step => step.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="recipe-detail-page">
        <Navbar />
        <main className="recipe-detail-loading" aria-label="Tarif yükleniyor">
          <div className="recipe-detail-skeleton-image" />
          <div className="recipe-detail-skeleton-copy" />
        </main>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-page">
        <Navbar />
        <main className="recipe-detail-feedback recipes-feedback-error" role="alert">
          <AlertCircle size={22} />
          <span>{error || 'Tarif bulunamadı.'}</span>
          <Link to="/tarifler" className="recipe-back-link"><ArrowLeft size={17} /> Tariflere dön</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <Navbar />
      <main className="recipe-detail-main">
        <Link to="/tarifler" className="recipe-back-link"><ArrowLeft size={17} /> Tariflere dön</Link>
        <div className="recipe-detail-layout">
          <section className="recipe-detail-story">
            <div className="recipe-detail-image-wrapper">
              {recipe.image_url ? (
                <img src={getImageUrl(recipe.image_url)} alt={recipe.title} className="recipe-detail-image" />
              ) : (
                <div className="recipe-detail-image recipe-detail-image-placeholder"><ChefHat size={64} /></div>
              )}
              <button
                type="button"
                className={`recipe-detail-favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                onClick={toggleFavorite}
                disabled={isFavoriteLoading}
                aria-label={isFavorite ? 'Tarifi favorilerden çıkar' : 'Tarifi favorilere ekle'}
                aria-pressed={isFavorite}
              >
                <Heart size={23} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="recipe-detail-heading">
              <div>
                <span className="recipe-detail-kicker">Şefin mutfağından</span>
                <h1>{recipe.title}</h1>
              </div>
              <span className="recipe-detail-time"><Clock3 size={18} /> {recipe.prep_time || 'Süre belirtilmedi'}</span>
            </div>
            {recipe.description && <p className="recipe-detail-description">{recipe.description}</p>}
            <div className="recipe-instructions">
              <h2>Tarif Yapımı</h2>
              <div className="recipe-instructions-text">
                {instructionSteps.map((step, index) => (
                  <p key={`${step}-${index}`}><span>{index + 1}</span>{step}</p>
                ))}
              </div>
            </div>
          </section>

          <aside className="recipe-ingredients-panel">
            <div className="ingredients-heading">
              <span className="ingredients-icon"><ShoppingBasket size={21} /></span>
              <div>
                <span className="recipe-detail-kicker">Sepete hazır</span>
                <h2>Gerekli Malzemeler</h2>
              </div>
            </div>
            <div className="ingredients-list">
              {ingredients.length > 0 ? ingredients.map((product) => {
                const option = getProductOption(product);
                return (
                  <div className="ingredient-item" key={product.id}>
                    <input
                      type="checkbox"
                      className="ingredient-checkbox"
                      checked={selectedIngredients.includes(product.id)}
                      onChange={() => toggleIngredient(product.id)}
                      aria-label={`${product.name} malzemesini seç`}
                    />
                    {product.image ? (
                      <img src={getImageUrl(product.image)} alt={product.name} />
                    ) : (
                      <div className="ingredient-image-placeholder"><ChefHat size={20} /></div>
                    )}
                    <div className="ingredient-info">
                      <strong>{product.name}</strong>
                      <span>{product.quantity} {product.unit || ''}</span>
                    </div>
                    <strong className="ingredient-price">{Number(option.price || product.price || 0).toFixed(2)} ₺</strong>
                  </div>
                );
              }) : <p className="ingredients-empty">Bu tarif için malzeme bulunamadı.</p>}
            </div>
            <button className="add-all-ingredients-button" onClick={handleAddSelectedToCart} disabled={isAdding || selectedIngredients.length === 0}>
              <ShoppingBasket size={19} /> {isAdding ? 'Ekleniyor...' : 'Seçili Malzemeleri Sepete Ekle'}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default RecipeDetailPage;
