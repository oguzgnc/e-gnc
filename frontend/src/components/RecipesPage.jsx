import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, ChefHat, ArrowRight, AlertCircle } from 'lucide-react';
import { recipeAPI } from '../services/api';
import Navbar from './Navbar';
import './RecipesPage.css';

const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:5000';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return imageUrl.startsWith('/uploads') || imageUrl.startsWith('/api/uploads')
    ? `${API_ORIGIN}${imageUrl}`
    : imageUrl;
};

function RecipeCardSkeleton() {
  return (
    <div className="recipe-card recipe-card-skeleton" aria-hidden="true">
      <div className="skeleton-block recipe-skeleton-image" />
      <div className="recipe-card-body">
        <div className="skeleton-block recipe-skeleton-title" />
        <div className="skeleton-block recipe-skeleton-meta" />
        <div className="skeleton-block recipe-skeleton-button" />
      </div>
    </div>
  );
}

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await recipeAPI.getAllRecipes();
        setRecipes(response.recipes || []);
      } catch (fetchError) {
        console.error('Tarifler yüklenemedi:', fetchError);
        setError(fetchError.message || 'Tarifler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipes-page">
      <Navbar />
      <main className="recipes-page-main">
        <header className="recipes-page-header">
          <span className="recipes-page-kicker"><ChefHat size={18} /> GNChol mutfağından</span>
          <h1>Şefin Önerileri</h1>
          <p>Seçtiğiniz tarifi keşfedin, gerekli malzemeleri tek seferde sepetinize ekleyin.</p>
        </header>

        {loading && (
          <div className="recipes-grid" aria-label="Tarifler yükleniyor">
            {Array.from({ length: 6 }).map((_, index) => <RecipeCardSkeleton key={index} />)}
          </div>
        )}

        {!loading && error && (
          <div className="recipes-feedback recipes-feedback-error" role="alert">
            <AlertCircle size={22} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="recipes-feedback">Henüz yayınlanmış bir tarif bulunmuyor.</div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <Link to={`/tarifler/${recipe.id}`} className="recipe-card-image-link">
                  {recipe.image_url ? (
                    <img src={getImageUrl(recipe.image_url)} alt={recipe.title} className="recipe-card-image" />
                  ) : (
                    <div className="recipe-card-image recipe-card-image-placeholder"><ChefHat size={42} /></div>
                  )}
                </Link>
                <div className="recipe-card-body">
                  <h2>{recipe.title}</h2>
                  <div className="recipe-card-meta">
                    <Clock3 size={17} aria-hidden="true" />
                    <span>{recipe.prep_time || 'Süre belirtilmedi'}</span>
                  </div>
                  <Link to={`/tarifler/${recipe.id}`} className="recipe-card-link">
                    Tarifi İncele <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecipesPage;
