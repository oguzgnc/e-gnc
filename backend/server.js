import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import initDatabase from './config/initDatabase.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Decide whether to run DB initialization:
// - In development run by default
// - In production skip unless FORCE_DB_INIT=true
const SHOULD_INIT_DB = process.env.FORCE_DB_INIT === 'true' || process.env.NODE_ENV !== 'production';
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? 'https://gnchol.com'
  : 'http://localhost:5173';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
  }
});

// Middleware
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve __dirname for ES modules and serve uploads statically before routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
// Debug: list uploads/products directory contents (if exists)
try {
  const uploadsProductsPath = path.join(__dirname, 'uploads', 'products');
  const exists = fs.existsSync(uploadsProductsPath);
  console.log('Static uploads path:', path.join(__dirname, 'uploads'));
  console.log('uploads/products exists:', exists);
  if (exists) {
    const files = fs.readdirSync(uploadsProductsPath);
    console.log('uploads/products files:', files);
  }
} catch (err) {
  console.error('Error listing uploads directory:', err);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recipes', recipeRoutes);

// Serve uploads statically (duplicate removed above)

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'GNC Sarkuteri API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route bulunamadı'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    if (SHOULD_INIT_DB) {
      await initDatabase();
    } else {
      console.log('ℹ️ Skipping database initialization (production mode)');
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda çalışıyor`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server başlatılamadı:', error);
    process.exit(1);
  }
};

startServer();
