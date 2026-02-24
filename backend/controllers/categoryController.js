import pool from '../config/database.js';

const toSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/ş/g, 's').replace(/Ş/g, 's')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/Ü/g, 'u')
    .replace(/ö/g, 'o').replace(/Ö/g, 'o')
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ç/g, 'c').replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, COALESCE(slug, key) AS slug FROM categories ORDER BY id'
    );
    return res.json({ success: true, categories: result.rows });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Kategori adı gereklidir' });
  }
  const slug = toSlug(name);
  try {
    const result = await pool.query(
      'INSERT INTO categories (key, name, slug) VALUES ($1, $2, $1) RETURNING id, name, slug',
      [slug, name.trim()]
    );
    return res.status(201).json({ success: true, category: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Bu kategori zaten mevcut' });
    }
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    }
    return res.json({ success: true, message: 'Kategori silindi' });
  } catch (err) {
    next(err);
  }
};
