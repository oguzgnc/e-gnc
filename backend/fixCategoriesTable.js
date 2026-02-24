import pool from './config/database.js';

const fix = async () => {
  try {
    // 1. slug sütununu ekle (yoksa)
    await pool.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(255)
    `);
    console.log('✅ Adım 1: slug sütunu eklendi (veya zaten mevcuttu)');

    // 2. Unique constraint ekle (zaten varsa atla)
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'categories_slug_key'
        ) THEN
          ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
        END IF;
      END$$
    `);
    console.log('✅ Adım 2: Unique constraint eklendi (veya zaten mevcuttu)');

    // 3. slug boş olan satırları key sütunundan doldur
    const result = await pool.query(`
      UPDATE categories
      SET slug = key
      WHERE slug IS NULL OR slug = ''
    `);
    console.log(`✅ Adım 3: ${result.rowCount} satırın slug değeri key'den dolduruldu`);

    console.log('\n🎉 Tablo başarıyla onarıldı ve güncellendi');
    process.exit(0);
  } catch (err) {
    console.error('❌ Hata:', err.message);
    process.exit(1);
  }
};

fix();
