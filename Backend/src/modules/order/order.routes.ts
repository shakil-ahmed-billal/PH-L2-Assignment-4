import { Router } from "express";
import { orderController } from "./order.controller";





const router: Router = Router()

router.get("/:id" , orderController.getOrderById)
router.post("/" , orderController.createNewOrder)





export const orderRouter = router