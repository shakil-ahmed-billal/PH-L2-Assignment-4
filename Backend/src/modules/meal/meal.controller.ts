import { Request, Response } from "express";
import { mealService } from "./meal.service";


const getAllMeals = async (req: Request, res: Response) => {
  try {
    const filters = {
      categoryId: req.query.categoryId as string,
      providerId: req.query.providerId as string,
      isVegetarian: req.query.isVegetarian === "true",
      isSpicy: req.query.isSpicy === "true",
      isPopular: req.query.isPopular === "true",
      search: req.query.search as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const meals = await mealService.getAllMeals(filters as any);

    res.status(200).send({
      success: true,
      message: "Meals fetched successfully",
      data: meals,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch meals",
      error: error.message || error,
    });
  }
};


const getMealById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const meal = await mealService.getMealById(id as any);

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


const getMealReviews = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const reviews = await mealService.getMealReviews(id as any);

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


const getRelatedMeals = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const relatedMeals = await mealService.getRelatedMeals(id as any);

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


const updateMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    const updatedMeal = await mealService.updateMeal(id as any, updateData);

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


const deleteMeal = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null,
    });
  }

  try {
    await mealService.deleteMeal(id as any);

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


const addMealReview = async (req: Request, res: Response) => {
  const { id } = req.params;
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
      mealId: id as any,
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