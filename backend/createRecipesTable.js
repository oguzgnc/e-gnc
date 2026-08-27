import pool from './config/database.js';

const createRecipesTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        prep_time VARCHAR(50),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ recipes tablosu başarıyla oluşturuldu');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity DECIMAL,
        unit VARCHAR(50)
      )
    `);
    console.log('✅ recipe_ingredients tablosu başarıyla oluşturuldu');
  } catch (error) {
    console.error('❌ Tarif tabloları oluşturulurken hata:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createRecipesTables();
