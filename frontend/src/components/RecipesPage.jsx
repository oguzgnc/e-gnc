import React, { useEffect, useState } from 'react';
import { ChefHat, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { favoriteAPI, recipeAPI } from '../services/api';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import './RecipesPage.css';

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
  const [favoriteRecipes, setFavoriteRecipes] = useState(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState(new Set());
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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!sessionStorage.getItem('token')) return;
      try {
        const response = await favoriteAPI.getFavorites();
        setFavoriteRecipes(new Set((response.favorites || []).map(recipe => recipe.id)));
      } catch (fetchError) {
        console.error('Favoriler yüklenemedi:', fetchError);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (recipeId) => {
    if (favoriteLoading.has(recipeId)) return;
    setFavoriteLoading(previousLoading => new Set(previousLoading).add(recipeId));

    try {
      const response = await favoriteAPI.toggleFavorite(recipeId);
      setFavoriteRecipes(previousFavorites => {
        const nextFavorites = new Set(previousFavorites);
        if (response.isFavorite) nextFavorites.add(recipeId);
        else nextFavorites.delete(recipeId);
        return nextFavorites;
      });
      toast.success(response.isFavorite ? 'Tarif favorilere eklendi!' : 'Tarif favorilerden çıkarıldı.');
    } catch (toggleError) {
      toast.error(toggleError.message || 'Favori güncellenemedi.');
    } finally {
      setFavoriteLoading(previousLoading => {
        const nextLoading = new Set(previousLoading);
        nextLoading.delete(recipeId);
        return nextLoading;
      });
    }
  };

  return (
    <div className="recipes-page">
      <Navbar />
      <main className="recipes-page-main">
        <header className="recipes-page-header flex flex-col items-center text-center mb-10">
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
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteRecipes.has(recipe.id)}
                isFavoriteLoading={favoriteLoading.has(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecipesPage;
