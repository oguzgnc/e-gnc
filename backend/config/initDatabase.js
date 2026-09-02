import pool from './database.js';

// Initialize database tables
// Note: Destructive operations (DROP TABLE, TRUNCATE, etc.) MUST be guarded
// and executed only in development. Use NODE_ENV==='development' or set FORCE_DB_INIT=true to allow.
const isDev = process.env.NODE_ENV === 'development';

const initDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration: is_verified ve verification_token kolonları yoksa ekle
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255)
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        volume VARCHAR(100)
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        options JSONB DEFAULT '[]',
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Kullanıcıların tarif favorileri
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        UNIQUE (user_id, recipe_id)
      )
    `);

    // Kategoriler tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Migration: slug kolonu yoksa ekle
    await pool.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(255)
    `);
    // slug için unique constraint yoksa ekle
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
    // slug boş olan satırları name'den üret
    await pool.query(`
      UPDATE categories
      SET slug = LOWER(
        REGEXP_REPLACE(
          TRANSLATE(name, 'şŞğĞüÜöÖıİçÇ', 'ssggvuoouicc'),
          '[^a-z0-9]+', '-', 'g'
        )
      )
      WHERE slug IS NULL OR slug = ''
    `);

    // Varsayılan kategorileri ekle (yoksa) — `slug` kullanılarak
    const defaultCategories = [
      { name: 'Et Ürünleri',     slug: 'et-urunleri' },
      { name: 'Süt Ürünleri',    slug: 'sut-urunleri' },
      { name: 'Ev Eşyaları',     slug: 'ev-esyalari' },
      { name: 'Baharatlar',      slug: 'baharatlar' },
      { name: 'Tarla Gübreleri', slug: 'tarla-gubreleri' }
    ];
    for (const cat of defaultCategories) {
      await pool.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
        [cat.name, cat.slug]
      );
    }

    // İletişim mesajları tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Mevcut tablolara eksik kolonları ekle (migration)
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true
    `);

    console.log('✅ Veritabanı tabloları başarıyla oluşturuldu');

    // Varsayılan admin hesabı oluştur (eğer yoksa)
    const adminCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@gncsarkuteri.com']
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      
      await pool.query(
        'INSERT INTO users (name, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', 'admin@gncsarkuteri.com', hashedPassword, 'admin', true]
      );
      
      console.log('✅ Varsayılan admin hesabı oluşturuldu (admin@gncsarkuteri.com / admin123)');
    } else {
      // Mevcut admin kullanıcıyı onaylı yap
      await pool.query('UPDATE users SET is_verified = true WHERE role = $1', ['admin']);
    }
    
    // Example: If there were DROP TABLE statements, they should be wrapped like:
    // if (isDev) {
    //   await pool.query('DROP TABLE IF EXISTS some_table');
    // }
  } catch (error) {
    console.error('❌ Veritabanı başlatma hatası:', error);
    throw error;
  }
};

export default initDatabase;
