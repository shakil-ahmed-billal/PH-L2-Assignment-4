import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { mealRoute } from "./modules/meal/meal.routes";
import { orderRouter } from "./modules/order/order.routes";
import { providerRouter } from "./modules/provider/provider.routes";







const router:Router = Router();


router.use("/auth" , authRouter);
router.use("/cat" , categoryRoute);
router.use("/meal" , mealRoute);
router.use('/order' , orderRouter);
router.use('/provider' , providerRouter);





export default router