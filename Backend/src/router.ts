import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { mealRoute } from "./modules/meal/meal.routes";
import { orderRouter } from "./modules/order/order.routes";
import { providerRouter } from "./modules/provider/provider.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { restaurantRouter } from "./modules/restaurant/restaurant.routes";







const router:Router = Router();


router.use("/auth" , authRouter);
router.use("/cat" , categoryRoute);
router.use("/meal" , mealRoute);
router.use('/order' , orderRouter);
router.use('/provider' , providerRouter);
router.use("/admin" , adminRouter)
router.use("/restaurant" , restaurantRouter)




export default router