import pool from '../config/database.js';

const parsePositiveInteger = (value) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

export const toggleFavorite = async (req, res) => {
  const authenticatedUserId = parsePositiveInteger(req.user?.userId);
  const recipeId = parsePositiveInteger(req.body?.recipe_id);
  const requestedUserId = req.body?.user_id === undefined
    ? authenticatedUserId
    : parsePositiveInteger(req.body.user_id);

  if (!authenticatedUserId || !recipeId || !requestedUserId) {
    return res.status(400).json({
      success: false,
      message: 'Geçerli kullanıcı ve tarif bilgileri gereklidir'
    });
  }

  if (requestedUserId !== authenticatedUserId) {
    return res.status(403).json({
      success: false,
      message: 'Başka bir kullanıcının favorileri değiştirilemez'
    });
  }

  try {
    const removedFavorite = await pool.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND recipe_id = $2
       RETURNING id`,
      [authenticatedUserId, recipeId]
    );

    if (removedFavorite.rows.length > 0) {
      return res.json({
        success: true,
        isFavorite: false,
        message: 'Tarif favorilerden çıkarıldı'
      });
    }

    await pool.query(
      `INSERT INTO favorites (user_id, recipe_id)
       VALUES ($1, $2)`,
      [authenticatedUserId, recipeId]
    );

    return res.status(201).json({
      success: true,
      isFavorite: true,
      message: 'Tarif favorilere eklendi'
    });
  } catch (error) {
    console.error('Favori değiştirme hatası:', error);
    if (error.code === '23503') {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı veya tarif bulunamadı'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Favori güncellenirken hata oluştu'
    });
  }
};

export const getFavorites = async (req, res) => {
  const userId = parsePositiveInteger(req.user?.userId);

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Geçerli bir kullanıcı bilgisi gereklidir'
    });
  }

  try {
    const result = await pool.query(
      `SELECT r.*
       FROM favorites f
       JOIN recipes r ON r.id = f.recipe_id
       WHERE f.user_id = $1
       ORDER BY f.id DESC`,
      [userId]
    );

    return res.json({
      success: true,
      favorites: result.rows
    });
  } catch (error) {
    console.error('Favorileri listeleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Favoriler listelenirken hata oluştu'
    });
  }
};
