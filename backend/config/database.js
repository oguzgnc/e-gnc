import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
// Eğer DATABASE_URL varsa onu kullan, yoksa ayrı değişkenleri kullan
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // Render internal connection için SSL gerekmez
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'gncsarkuteri',
    });

// Test database connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlandı');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL bağlantı hatası:', err);
  process.exit(-1);
});

export default pool;
