import express from 'express';
import { register, login, getProfile, verifyEmail } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', register);

// Kullanıcı girişi
router.post('/login', login);

// E-posta doğrulama rotası (GET ve POST destekler)
router.get('/verify/:token', verifyEmail);
router.post('/verify/:token', verifyEmail);

// Kullanıcı profili (korumalı route)
router.get('/profile', verifyToken, getProfile);

export default router;
