import pool from './config/database.js';

async function updateCategories() {
  try {
    console.log('🔄 Kategoriler güncelleniyor...');
    
    const result = await pool.query(`
      UPDATE products 
      SET category = 'et-urunleri' 
      WHERE category IN ('sucuk', 'sosis', 'salam', 'pastirma', 'kavurma', 'jambon')
    `);
    
    console.log(`✅ ${result.rowCount} ürün kategorisi 'et-urunleri' olarak güncellendi`);
    
    const products = await pool.query('SELECT product_id, name, category FROM products');
    console.log('\n📦 Güncel Ürünler:');
    products.rows.forEach(p => {
      console.log(`  - ${p.name} (${p.product_id}): ${p.category}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

updateCategories();
