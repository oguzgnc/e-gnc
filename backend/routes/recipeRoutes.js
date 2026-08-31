import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createAdminRecipe,
  deleteAdminRecipe
} from '../controllers/recipeController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { upload, processProductImage } from '../middleware/upload.js';

const router = express.Router();

// Genel (Public) Rotalar
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Admin Rotaları
router.post('/', verifyToken, isAdmin, upload.single('image'), processProductImage, createAdminRecipe);
router.delete('/:id', verifyToken, isAdmin, deleteAdminRecipe);

export default router;