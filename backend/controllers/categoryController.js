import pool from '../config/database.js';

// Return categories from categories table if exists, otherwise distinct categories from products
export const getCategories = async (req, res, next) => {
  try {
    // Try categories table first
    const tableCheck = await pool.query(`
      SELECT to_regclass('public.categories') as exists
    `);
    const exists = tableCheck.rows[0].exists;

    if (exists) {
      const result = await pool.query('SELECT key as id, name FROM categories ORDER BY id');
      return res.json({ success: true, categories: result.rows });
    }

    // Fallback: distinct categories from products
    const prodResult = await pool.query(`
      SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category
    `);
    const categories = prodResult.rows.map(r => ({ id: r.category, name: r.category }));
    return res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

