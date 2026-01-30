import { Router } from "express";
import { mealController } from "./meal.controller";



const router:Router = Router() ;

router.get("/" , mealController.getAllMeal)


export const mealRoute = router 
