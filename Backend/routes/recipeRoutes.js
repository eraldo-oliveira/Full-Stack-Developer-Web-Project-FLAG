import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  searchRecipesByIngredient,
  getSimilarRecipes,
  getChefSuggestion,
} from "../controllers/recipeController.js";
import upload from "../middlewares/uploadMiddleware.js"; // Middleware de upload

const router = express.Router();

// Rotas existentes
router.get("/search", searchRecipesByIngredient);
router.get("/chef-suggestion", getChefSuggestion);
router.get("/", getAllRecipes);
router.get("/:_id", getRecipeById);
router.post("/", upload.single("imageFile"), createRecipe);
router.put("/:_id", upload.single("imageFile"), updateRecipe);
router.delete("/:_id", deleteRecipe);
router.patch("/:slug/like", likeRecipe);

// ✅ Nova rota para receitas similares
router.get("/similar/:slug", getSimilarRecipes);

export default router;


