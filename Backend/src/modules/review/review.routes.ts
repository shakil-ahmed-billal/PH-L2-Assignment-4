import { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router: Router = Router();


router.get("/:customerId", auth(UserRole.CUSTOMER), reviewController.getCustomerOrders);
router.post("/:orderId/review", auth(UserRole.CUSTOMER), reviewController.addOrderReview);
router.patch("/:orderId/review/:reviewId", auth(UserRole.CUSTOMER), reviewController.updateOrderReview);
router.delete("/:orderId/review/:reviewId", auth(UserRole.CUSTOMER), reviewController.deleteOrderReview);

export const reviewRouter = router;