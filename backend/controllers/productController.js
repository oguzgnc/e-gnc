import pool from '../config/database.js';

// Tüm ürünleri listele
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Ürünleri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler listelenirken hata oluştu'
    });
  }
};

// Yeni ürün ekle
export const createProduct = async (req, res) => {
  const { product_id, name, description, category, price, image, options } = req.body;

  if (!product_id || !name || !category || !price) {
    return res.status(400).json({
      success: false,
      message: 'Ürün ID, isim, kategori ve fiyat gereklidir'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (product_id, name, description, category, price, image, options) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [product_id, name, description || '', category, price, image || '', JSON.stringify(options || [])]
    );

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün eklenirken hata oluştu'
    });
  }
};

// Ürün güncelle
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_id, name, description, category, price, image, options } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET product_id = $1, name = $2, description = $3, category = $4, 
           price = $5, image = $6, options = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [product_id, name, description, category, price, image, JSON.stringify(options), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu'
    });
  }
};

// Ürün sil
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu'
    });
  }
};

// Kategoriye göre ürünleri getir
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );

    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Kategori ürünleri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler listelenirken hata oluştu'
    });
  }
};
