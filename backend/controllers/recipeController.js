import pool from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = async (imageUrl) => {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  try {
    const physicalPath = path.join(__dirname, '../uploads/products', filename);
    await fs.unlink(physicalPath);
    console.log(`🗑️ Fiziksel resim silindi: ${filename}`);
  } catch (error) {
    console.log(`⚠️ Resim silinemedi veya zaten yok: ${filename} - ${error.message}`);
  }
};

// Tüm tarifleri listele
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

// ID'ye göre tek bir tarif ve malzemelerini getir
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

// Admin: Yeni tarif ve malzemelerini ekle
export const createAdminRecipe = async (req, res) => {
  const body = req.body || {};
  const title = (body.title || body.baslik || body.name || '').trim();
  const description = (body.description || body.aciklama || '').trim();
  const instructions = (body.instructions || body.talimatlar || body.yapilis || '').trim();
  const prep_time = (body.prep_time || body.prepTime || body.sure || body.time || '').trim();

  // Yüklenen resim dosyası varsa middleware URL'si, yoksa body'den gelen URL
  const uploadedImageUrl = req.customImageUrl;
  const image_url = uploadedImageUrl || (body.image_url || body.imageUrl || body.image || body.gorsel || '').trim();

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Tarif başlığı zorunludur'
    });
  }

  // Malzemeleri (ürün ID ve miktarları) normalize et
  let ingredientsList = [];
  const rawIngredients = body.ingredients || body.recipe_ingredients || body.products || body.malzemeler || [];

  try {
    if (typeof rawIngredients === 'string') {
      ingredientsList = JSON.parse(rawIngredients);
    } else if (Array.isArray(rawIngredients)) {
      ingredientsList = rawIngredients;
    }
  } catch (e) {
    console.error('Malzeme parse hatası:', e);
    ingredientsList = [];
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. recipes tablosuna yeni tarifi kaydet
    const recipeResult = await client.query(
      `INSERT INTO recipes (title, description, instructions, prep_time, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, instructions, prep_time, image_url]
    );

    const createdRecipe = recipeResult.rows[0];
    const recipeId = createdRecipe.id;

    // 2. recipe_ingredients tablosuna seçili ürünleri ve miktarlarını ekle
    const savedIngredients = [];
    if (Array.isArray(ingredientsList) && ingredientsList.length > 0) {
      for (const item of ingredientsList) {
        const productId = item.product_id || item.productId || item.id || item.product;
        const rawQuantity = item.quantity !== undefined && item.quantity !== null && item.quantity !== ''
          ? item.quantity
          : (item.amount || item.miktar || 1);
        const parsedQuantity = parseFloat(rawQuantity);
        const quantity = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity;
        const unit = (item.unit || item.birim || '').trim();

        if (productId) {
          const ingResult = await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, product_id, quantity, unit)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [recipeId, productId, quantity, unit]
          );
          savedIngredients.push(ingResult.rows[0]);
        }
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Tarif ve malzemeleri başarıyla eklendi',
      recipe: createdRecipe,
      ingredients: savedIngredients
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Admin tarif ekleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Tarif eklenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
};

// Admin: Tarifi ve ilişkili malzemelerini sil
export const deleteAdminRecipe = async (req, res) => {
  const recipeId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(recipeId)) {
    return res.status(400).json({
      success: false,
      message: 'Geçerli bir tarif ID gereklidir'
    });
  }

  try {
    // Silinmeden önce mevcut tarifi kontrol et (resim temizliği için)
    const existingRes = await pool.query('SELECT * FROM recipes WHERE id = $1', [recipeId]);

    if (existingRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Silinecek tarif bulunamadı'
      });
    }

    const recipeToDelete = existingRes.rows[0];

    // Köprü tablosundaki kayıtları sil (Foreign key cascade yoksa garantiye almak için)
    await pool.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);

    // recipes tablosundan tarifi sil
    await pool.query('DELETE FROM recipes WHERE id = $1', [recipeId]);

    // Varsa sunucu üzerindeki resim dosyasını sil
    if (recipeToDelete.image_url) {
      await deleteImageFile(recipeToDelete.image_url);
    }

    return res.json({
      success: true,
      message: 'Tarif başarıyla silindi'
    });
  } catch (error) {
    console.error('Admin tarif silme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Tarif silinirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};