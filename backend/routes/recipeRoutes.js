import express from 'express';
import { getAllRecipes, getRecipeById } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

export default router;