import { Router } from "express";
import { mealController } from "./meal.controller";



const router:Router = Router() ;

router.get("/" , mealController.getAllMeal)
router.get('/:id' , mealController.getMealById)
router.post("/" , mealController.createMeal)


export const mealRoute = router 
