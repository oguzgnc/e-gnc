#!/usr/bin/env node
/**
 * Simple seed script to create categories table and insert initial categories.
 * Usage: node backend/seed.js
 * Note: This script is safe to run multiple times (uses INSERT ... ON CONFLICT DO NOTHING).
 */
import dotenv from 'dotenv';
dotenv.config();

import pool from './config/database.js';

const categories = [
  { id: 'et-urunleri', name: 'Et Ürünleri' },
  { id: 'sut-urunleri', name: 'Süt Ürünleri' },
  { id: 'tarla-gubr', name: 'Tarla Gübreleri' },
  { id: 'baharatlar', name: 'Baharatlar' },
  { id: 'ev-esyalari', name: 'Ev Eşyaları' }
];

const run = async () => {
  try {
    // Create categories table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `);

    // Upsert categories
    for (const c of categories) {
      await pool.query(
        `INSERT INTO categories (key, name) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name`,
        [c.id, c.name]
      );
    }

    console.log('✅ Kategoriler seedlendi.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed hatası:', err);
    process.exit(1);
  }
};

run();

