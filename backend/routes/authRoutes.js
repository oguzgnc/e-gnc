import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', register);

// Kullanıcı girişi
router.post('/login', login);

// Kullanıcı profili (korumalı route)
router.get('/profile', verifyToken, getProfile);

export default router;
