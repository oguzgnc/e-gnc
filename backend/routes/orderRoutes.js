import express from 'express';
import { createOrder, getUserOrders, getOrderDetails } from '../controllers/orderController.js';
import { verifyToken, verifyTokenOptional } from '../middleware/auth.js';

const router = express.Router();

// Sipariş oluşturma - herkes yapabilir, ama token varsa kullanıcıya bağla
router.post('/create', verifyTokenOptional, createOrder);

// Kullanıcının kendi siparişleri - authentication gerekli
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/:orderId', verifyToken, getOrderDetails);

export default router;
