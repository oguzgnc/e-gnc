import express from 'express';
import {
  getAllMessages,
  createMessage,
  markAsRead,
  deleteMessage
} from '../controllers/contactController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - Mesaj gönder
router.post('/', createMessage);

// Admin routes
router.get('/messages', verifyToken, isAdmin, getAllMessages);
router.put('/messages/:id/read', verifyToken, isAdmin, markAsRead);
router.delete('/messages/:id', verifyToken, isAdmin, deleteMessage);

export default router;
