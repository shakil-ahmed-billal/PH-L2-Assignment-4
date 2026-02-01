import { Router } from "express";
import { reviewController } from "./review.controller";
const router = Router();
router.get("/:customerId", reviewController.getCustomerOrders);
router.post("/:orderId/review", reviewController.addOrderReview);
router.patch("/:orderId/review/:reviewId", reviewController.updateOrderReview);
router.delete("/:orderId/review/:reviewId", reviewController.deleteOrderReview);
export const reviewRouter = router;
//# sourceMappingURL=review.routes.js.map