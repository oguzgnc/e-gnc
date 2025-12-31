import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  toggleProductStock
} from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);

// Admin only routes
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.put('/:id/stock', verifyToken, isAdmin, toggleProductStock);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
