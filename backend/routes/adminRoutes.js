import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Tüm route'lar admin yetkisi gerektirir
router.use(verifyToken, isAdmin);

// Dashboard istatistikleri
router.get('/stats', getDashboardStats);

// Kullanıcı yönetimi
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Sipariş yönetimi
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

export default router;
