import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Clock3, Heart } from 'lucide-react';
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

function RecipeCard({ recipe, isFavorite, onToggleFavorite, isFavoriteLoading = false }) {
  return (
    <article className="recipe-card">
      <div className="recipe-card-image-wrapper">
        <Link to={`/tarifler/${recipe.id}`} className="recipe-card-image-link">
          {recipe.image_url ? (
            <img src={getImageUrl(recipe.image_url)} alt={recipe.title} className="recipe-card-image" />
          ) : (
            <div className="recipe-card-image recipe-card-image-placeholder"><ChefHat size={42} /></div>
          )}
        </Link>
        <button
          type="button"
          className={`recipe-favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={() => onToggleFavorite(recipe.id)}
          disabled={isFavoriteLoading}
          aria-label={isFavorite ? `${recipe.title} favorilerden çıkar` : `${recipe.title} favorilere ekle`}
          aria-pressed={isFavorite}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
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
  );
}

export default RecipeCard;
