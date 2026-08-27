import pool from '../config/database.js';

export const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );

    return res.json({
      success: true,
      recipes: result.rows
    });
  } catch (error) {
    console.error('Tarifleri listeleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Tarifler listelenirken hata oluştu'
    });
  }
};

export const getRecipeById = async (req, res) => {
  const recipeId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(recipeId)) {
    return res.status(400).json({
      success: false,
      message: 'Geçerli bir tarif id değeri gereklidir'
    });
  }

  try {
    const recipeResult = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [recipeId]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarif bulunamadı'
      });
    }

    const ingredientsResult = await pool.query(
      `SELECT p.*, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN products p ON ri.product_id = p.id
       WHERE ri.recipe_id = $1`,
      [recipeId]
    );

    return res.json({
      success: true,
      recipe: recipeResult.rows[0],
      ingredients: ingredientsResult.rows
    });
  } catch (error) {
    console.error('Tarif detayını getirme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Tarif detayı alınırken hata oluştu'
    });
  }
};