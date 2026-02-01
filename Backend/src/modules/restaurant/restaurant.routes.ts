import { Router } from "express";
import { restaurantController } from "./restaurant.controller";

const router: Router = Router();


router.get("/", restaurantController.getAllRestaurant);
router.get("/:id", restaurantController.getRestaurantById);
router.get("/:id/meals", restaurantController.getRestaurantMeals);
router.get("/:id/reviews", restaurantController.getRestaurantReviews);
router.get("/:id/stats", restaurantController.getRestaurantStats);
router.patch("/:id", restaurantController.updateRestaurant);

export const restaurantRouter = router;