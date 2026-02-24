import pool from './config/database.js';

const run = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id   SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);
    console.log('✅ Categories tablosu başarıyla oluşturuldu');

    const defaults = [
      { name: 'Et Ürünleri',     slug: 'et-urunleri' },
      { name: 'Süt Ürünleri',    slug: 'sut-urunleri' },
      { name: 'Ev Eşyaları',     slug: 'ev-esyalari' },
      { name: 'Baharatlar',      slug: 'baharatlar' },
      { name: 'Tarla Gübreleri', slug: 'tarla-gubreleri' }
    ];

    for (const cat of defaults) {
      await pool.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug]
      );
    }
    console.log('✅ Varsayılan kategoriler eklendi (zaten varsa atlandı)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Hata:', err.message);
    process.exit(1);
  }
};

run();
