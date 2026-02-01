import { Router } from "express";
import { restaurantController } from "./restaurant.controller";

const router: Router = Router();


router.get("/", restaurantController.getAllRestaurant);
router.get("/:id", restaurantController.getRestaurantById);
router.get("/:id/meals", restaurantController.getRestaurantMeals);
router.get("/:id/reviews", restaurantController.getRestaurantReviews);

export const restaurantRouter = router;