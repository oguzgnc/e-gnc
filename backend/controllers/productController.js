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
  // Accept multipart/form-data via multer + sharp (req.filePath) or JSON body
  console.log('--- YENİ CREATE İSTEĞİ ---');
  console.log('req.headers.content-type:', req.headers['content-type']);
  console.log('req.file present:', !!req.file);
  const body = req.body || {};
  const product_id = (body.product_id || body.productId || body.productid || '').trim();
  const name = (body.name || '').trim();
  const description = (body.description || '').trim();
  const category = (body.category || '').trim();
  const priceRaw = body.price !== undefined && body.price !== null ? body.price : null;
  const price = priceRaw !== null ? parseFloat(priceRaw) : null;
  const optionsRaw = body.options || body.opts || '[]';
  const uploadedImagePath = req.customImageUrl; // set by processProductImage middleware

  if (!product_id || !name || !category || price === null || Number.isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: 'Ürün ID, isim, kategori ve geçerli fiyat gereklidir'
    });
  }

  try {
    // Normalize options
    let opts = [];
    try {
      if (typeof optionsRaw === 'string') opts = JSON.parse(optionsRaw);
      else opts = optionsRaw;
    } catch (e) {
      opts = [];
    }
    if (!Array.isArray(opts)) {
      if (opts && typeof opts === 'object' && Object.keys(opts).length > 0) opts = [opts];
      else opts = [];
    }

    const imgToSave = uploadedImagePath ? uploadedImagePath : (body.image || '');
    const result = await pool.query(
      `INSERT INTO products (product_id, name, description, category, price, image, options) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [product_id, name, description || '', category, price, imgToSave, JSON.stringify(opts)]
    );

    return res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ürün eklenirken hata oluştu'
    });
  }
};

// Ürün güncelle
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log('--- YENİ UPDATE İSTEĞİ ---');
  console.log('req.headers.content-type:', req.headers['content-type']);
  console.log('req.file present:', !!req.file);
  const body = req.body || {};

  try {
    // Fetch existing product to preserve fields if not provided
    const existingRes = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }
    const existing = existingRes.rows[0];

    // Determine new values: prefer body values, otherwise keep existing
    const product_id = (body.product_id || body.productId || body.productid || existing.product_id || '').trim();
    const name = (body.name || existing.name || '').trim();
    const description = (body.description || existing.description || '').trim();
    const category = (body.category || existing.category || '').trim();
    const priceRaw = body.price !== undefined && body.price !== null ? body.price : existing.price;
    const price = priceRaw !== null ? parseFloat(priceRaw) : null;
    const optionsRaw = body.options || body.opts || existing.options || '[]';

    if (!product_id || !name || !category || price === null || Number.isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Ürün ID, isim, kategori ve geçerli fiyat gereklidir'
      });
    }

    // Normalize options
    let opts = [];
    try {
      if (typeof optionsRaw === 'string') opts = JSON.parse(optionsRaw);
      else opts = optionsRaw;
    } catch (e) {
      opts = existing.options ? (Array.isArray(existing.options) ? existing.options : []) : [];
    }
    if (!Array.isArray(opts)) {
      if (opts && typeof opts === 'object' && Object.keys(opts).length > 0) opts = [opts];
      else opts = [];
    }

    const uploadedImagePath = req.customImageUrl;
    if (uploadedImagePath && existing.image) {
      await deleteImageFile(existing.image);
    }
    const imgToSave = uploadedImagePath ? uploadedImagePath : (body.image || existing.image || '');

    const result = await pool.query(
      `UPDATE products 
       SET product_id = $1, name = $2, description = $3, category = $4, 
           price = $5, image = $6, options = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [product_id, name, description, category, price, imgToSave, JSON.stringify(opts), id]
    );

    return res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu'
    });
  }
};

// Ürün sil
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRes = await pool.query('SELECT image FROM products WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }
    const imageToDelete = existingRes.rows[0].image;

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    await deleteImageFile(imageToDelete);

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

// Ürün stok durumunu güncelle
export const toggleProductStock = async (req, res) => {
  const { id } = req.params;
  const { in_stock } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET in_stock = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [in_stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Stok durumu güncellendi',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Stok güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Stok durumu güncellenirken hata oluştu'
    });
  }
};
