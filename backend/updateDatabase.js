import pool from './config/database.js';

async function updateDatabase() {
  try {
    console.log('🔄 Veritabanı güncelleniyor...');
    
    // in_stock kolonunu ekle
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
    `);
    
    console.log('✅ in_stock kolonu eklendi');
    
    // Kolonları ekle
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
    `);
    
    console.log('✅ customer_name ve customer_email kolonları eklendi');
    
    // user_id'yi opsiyonel yap (CASCADE yerine SET NULL)
    await pool.query(`
      ALTER TABLE orders 
      DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
    `);
    
    await pool.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES users(id) 
      ON DELETE SET NULL;
    `);
    
    console.log('✅ user_id constraint güncellendi');
    console.log('✅ Veritabanı güncelleme tamamlandı!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

updateDatabase();
