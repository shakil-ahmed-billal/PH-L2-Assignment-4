import { Router } from "express";
import { reviewController } from "./review.controller";


const router: Router = Router();


router.get("/:customerId", reviewController.getCustomerOrders);
router.get("/details/:orderId", reviewController.getOrderById);
router.get("/provider/:providerId", reviewController.getProviderOrders);
router.post("/", reviewController.createOrder);
router.patch("/:orderId/status", reviewController.updateOrderStatus);
router.post("/:orderId/review", reviewController.addOrderReview);
router.patch("/:orderId/review/:reviewId", reviewController.updateOrderReview);
router.delete("/:orderId/review/:reviewId", reviewController.deleteOrderReview);

export const reviewRouter = router;