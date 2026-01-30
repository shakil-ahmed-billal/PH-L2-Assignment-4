import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { mealRoute } from "./modules/meal/meal.routes";







const router:Router = Router();


router.use("/auth" , authRouter);
router.use("/cat" , categoryRoute);
router.use("/meal" , mealRoute);





export default router