import { Request, Response } from "express";
import { mealService } from "./meal.service";

/**
 * Get all meals with pagination and filters
 * GET /api/meals
 */
const getAllMeals = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const search = req.query.search as string;
    const sort = req.query.sort as "popular" | "price-low" | "price-high" | "rating" | "newest";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    // Category can be single or multiple
    let categoryId: string | string[] | undefined;
    if (req.query.categoryId) {
      categoryId = Array.isArray(req.query.categoryId)
        ? (req.query.categoryId as string[])
        : [req.query.categoryId as string];
    }

    // Boolean filters
    const isVegetarian = req.query.isVegetarian === "true" ? true : undefined;
    const isSpicy = req.query.isSpicy === "true" ? true : undefined;
    const isPopular = req.query.isPopular === "true" ? true : undefined;

    // Price filters
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    const filters = {
      search,
      categoryId,
      isVegetarian,
      isSpicy,
      isPopular,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    };

    const result = await mealService.getAllMealsWithPagination(filters);

    res.status(200).send({
      success: true,
      message: "Meals fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch meals",
      error: error.message || error,
    });
  }
};

/**
 * Get meal by ID
 * GET /api/meals/:id
 */
const getMealById = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const meal = await mealService.getMealById(id);

    if (!meal) {
      return res.status(404).send({
        success: false,
        message: "Meal not found",
        data: null,
      });
    }

    res.status(200).send({
      success: true,
      message: "Meal fetched successfully",
      data: meal,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch meal details",
      error: error.message || error,
    });
  }
};

/**
 * Get reviews for a meal
 * GET /api/meals/:id/reviews
 */
const getMealReviews = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const reviews = await mealService.getMealReviews(id);

    res.status(200).send({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message || error,
    });
  }
};

/**
 * Get related meals
 * GET /api/meals/:id/related
 */
const getRelatedMeals = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const relatedMeals = await mealService.getRelatedMeals(id);

    res.status(200).send({
      success: true,
      message: "Related meals fetched successfully",
      data: relatedMeals,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch related meals",
      error: error.message || error,
    });
  }
};

/**
 * Create a new meal
 * POST /api/meals
 */
const createMeal = async (req: Request, res: Response) => {
  const mealData = req.body;

  // Validation
  if (!mealData.name || !mealData.price || !mealData.providerId || !mealData.categoryId) {
    return res.status(400).send({
      success: false,
      message: "Name, price, provider ID, and category ID are required",
      data: null,
    });
  }

  try {
    const newMeal = await mealService.createMeal(mealData);

    res.status(201).send({
      success: true,
      message: "Meal created successfully",
      data: newMeal,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to create meal",
      error: error.message || error,
    });
  }
};

/**
 * Update a meal
 * PATCH /api/meals/:id
 */
const updateMeal = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updateData = req.body;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const updatedMeal = await mealService.updateMeal(id, updateData);

    res.status(200).send({
      success: true,
      message: "Meal updated successfully",
      data: updatedMeal,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to update meal",
      error: error.message || error,
    });
  }
};

/**
 * Delete a meal (soft delete)
 * DELETE /api/meals/:id
 */
const deleteMeal = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    await mealService.deleteMeal(id);

    res.status(200).send({
      success: true,
      message: "Meal deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to delete meal",
      error: error.message || error,
    });
  }
};

/**
 * Add review to meal
 * POST /api/meals/:id/reviews
 */
const addMealReview = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { userId, rating, comment } = req.body;

  if (!id || !userId || !rating) {
    return res.status(400).send({
      success: false,
      message: "Meal ID, user ID, and rating are required",
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
    const review = await mealService.addMealReview({
      mealId: id,
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
      message: "Failed to add review",
      error: error.message || error,
    });
  }
};

export const mealController = {
  getAllMeals,
  getMealById,
  getMealReviews,
  getRelatedMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  addMealReview,
};