import { Request, Response } from "express";
import { restaurantService } from "./restaurant.service";

/**
 * Get all restaurants
 * GET /api/restaurant
 */
const getAllRestaurant = async (req: Request, res: Response) => {
  try {
    const result = await restaurantService.getAllRestaurant();

    if (result) {
      res.status(200).send({
        success: true,
        message: "Restaurants fetched successfully",
        data: result,
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurants",
      error: err.message || err,
    });
  }
};

/**
 * Get restaurant by ID
 * GET /api/restaurant/:id
 */
const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null,
    });
  }

  try {
    const result: any = await restaurantService.getRestaurantById(id as any);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
        data: null,
      });
    }

    res.status(200).send({
      success: true,
      message: "Restaurant fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant details",
      error: error.message || error,
    });
  }
};

/**
 * Get all meals for a restaurant
 * GET /api/restaurant/:id/meals
 */
const getRestaurantMeals = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null,
    });
  }

  try {
    const meals = await restaurantService.getRestaurantMeals(id as any);

    res.status(200).send({
      success: true,
      message: "Meals fetched successfully",
      data: meals,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant meals",
      error: error.message || error,
    });
  }
};

/**
 * Get all reviews for a restaurant
 * GET /api/restaurant/:id/reviews
 */
const getRestaurantReviews = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null,
    });
  }

  try {
    const reviews = await restaurantService.getRestaurantReviews(id as any);

    res.status(200).send({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant reviews",
      error: error.message || error,
    });
  }
};

/**
 * Update restaurant profile
 * PATCH /api/restaurant/:id
 */
const updateRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null,
    });
  }

  try {
    const updatedRestaurant = await restaurantService.updateRestaurant(id as any, updateData);

    res.status(200).send({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to update restaurant",
      error: error.message || error,
    });
  }
};

/**
 * Get restaurant statistics
 * GET /api/restaurant/:id/stats
 */
const getRestaurantStats = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null,
    });
  }

  try {
    const stats = await restaurantService.getRestaurantStats(id as any);

    res.status(200).send({
      success: true,
      message: "Statistics fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant statistics",
      error: error.message || error,
    });
  }
};

export const restaurantController = {
  getAllRestaurant,
  getRestaurantById,
  getRestaurantMeals,
  getRestaurantReviews,
  updateRestaurant,
  getRestaurantStats,
};