import { Router } from "express";
import * as auth from "../controllers/authController.js";
import * as prop from "../controllers/propertyController.js";
import * as rec from "../controllers/recommendationController.js";
import * as fav from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

export const router = Router();

// auth
router.post("/register", auth.register);
router.post("/login", auth.login);

// properties
router.get("/properties", prop.list);
router.post("/properties", protect, prop.create);
router.put("/properties/:id", protect, prop.update);
router.delete("/properties/:id", protect, prop.remove);

// favorites
router.get("/favorites", protect, fav.getFavorites);
router.post("/favorites", protect, fav.addFavorite);
router.delete("/favorites/:id", protect, fav.removeFavorite);

// recommendations
router.post("/recommend", protect, rec.recommend);
router.get("/recommendations", protect, rec.getRecommendations);
router.get("/sent-recommendations", protect, rec.getSentRecommendations);

export default router;
