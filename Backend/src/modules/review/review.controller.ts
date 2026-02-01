import { Request, Response } from "express";
import { reviewService } from "./review.service";

/**
 * Get customer orders
 * GET /api/order/:customerId
 */
const getCustomerOrders = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).send({
      success: false,
      message: "Customer ID is required",
      data: null,
    });
  }

  try {
    const orders = await reviewService.getCustomerOrders(customerId as any);

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error: error.message || error,
    });
  }
};

/**
 * Add review for an order
 * POST /api/order/:orderId/review
 */
const addOrderReview = async (req: Request, res: Response) => {
  const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const { userId, rating, comment } = req.body;

  if (!orderId || !userId || !rating) {
    return res.status(400).send({
      success: false,
      message: "Order ID, user ID, and rating are required",
      data: null,
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).send({
      success: false,
      message: "Rating must be between 1 and 5",
      data: null,
    });
  }

  try {
    const review = await reviewService.addOrderReview({
      orderId,
      userId,
      rating,
      comment,
    });

    res.status(201).send({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message || "Failed to add review",
      error: error.message || error,
    });
  }
};

/**
 * Update order review
 * PATCH /api/order/:orderId/review/:reviewId
 */
const updateOrderReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!reviewId) {
    return res.status(400).send({
      success: false,
      message: "Review ID is required",
      data: null,
    });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).send({
      success: false,
      message: "Rating must be between 1 and 5",
      data: null,
    });
  }

  try {
    const updatedReview = await reviewService.updateOrderReview(reviewId as any, {
      rating,
      comment,
    });

    res.status(200).send({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to update review",
      error: error.message || error,
    });
  }
};

/**
 * Delete order review
 * DELETE /api/order/:orderId/review/:reviewId
 */
const deleteOrderReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res.status(400).send({
      success: false,
      message: "Review ID is required",
      data: null,
    });
  }

  try {
    await reviewService.deleteOrderReview(reviewId as any);

    res.status(200).send({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to delete review",
      error: error.message || error,
    });
  }
};

export const reviewController = {
  getCustomerOrders,
  addOrderReview,
  updateOrderReview,
  deleteOrderReview,
};