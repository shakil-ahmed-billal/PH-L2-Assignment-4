import { Router } from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../middlewares/auth";




const router: Router = Router()

router.get("/:id" , auth(UserRole.CUSTOMER), orderController.getOrderById)
router.post("/" , auth(UserRole.CUSTOMER), orderController.createNewOrder)





export const orderRouter = router