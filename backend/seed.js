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
  { id: 'tarla-gubreleri', name: 'Tarla Gübreleri' },
  { id: 'baharatlar', name: 'Baharatlar' },
  { id: 'ev-esyalari', name: 'Ev Eşyaları' }
];

const run = async () => {
  try {
    // Keep this schema aligned with initDatabase.js and categoryController.js.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Upsert categories
    for (const c of categories) {
      await pool.query(
        `INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
        [c.name, c.id]
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

