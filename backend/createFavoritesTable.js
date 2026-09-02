import pool from './config/database.js';

const createFavoritesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        UNIQUE (user_id, recipe_id)
      )
    `);

    console.log('✅ favorites tablosu başarıyla oluşturuldu');
  } catch (error) {
    console.error('❌ favorites tablosu oluşturulurken hata:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createFavoritesTable();
