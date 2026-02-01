import { Router } from "express";
import { mealController } from "./meal.controller";

const router: Router = Router();


router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);
router.get("/:id/reviews", mealController.getMealReviews);
router.get("/:id/related", mealController.getRelatedMeals);
router.post("/", mealController.createMeal);
router.patch("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);
router.post("/:id/reviews", mealController.addMealReview);

export const mealRouter = router;