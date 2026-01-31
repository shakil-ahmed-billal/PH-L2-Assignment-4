import { Request, Response } from "express";
import { providerService } from "./provider.service";

/**
 * Get provider meals by provider ID
 * GET /api/provider/stats/:id
 */
const getProviderStats = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const meals = await providerService.getProviderStats(
      providerId as string
    );

    res.status(200).json({
      success: true,
      message: "Provider meals retrieved successfully",
      data: meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get all orders for a provider
 * GET /api/provider/orders/:id
 */
const getOrderByProviderId = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const orders = await providerService.getOrderByProviderId(
      providerId as string
    );
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get all meals for a provider
 * GET /api/provider/meals/:id
 */
const getProviderMealById = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const meals = await providerService.getMealsByProviderId(
      providerId as string
    );

    res.status(200).json({
      success: true,
      message: "Provider meals retrieved successfully",
      data: meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get provider dashboard overview
 * GET /api/provider/dashboard/:id
 */
const getProviderDashboard = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const dashboard = await providerService.getProviderDashboard(
      providerId as string
    );

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get provider profile
 * GET /api/provider/profile/:id
 */
const getProviderProfile = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const profile = await providerService.getProviderProfile(
      providerId as string
    );

    res.status(200).json({
      success: true,
      message: "Provider profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Update provider profile
 * PUT /api/provider/profile/:id
 * Body: { restaurant?, description?, address?, phone? }
 */
const updateProviderProfile = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const profileData = req.body;

    const profile = await providerService.updateProviderProfile(
      providerId as string,
      profileData
    );

    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get revenue analytics
 * GET /api/provider/analytics/:id/revenue?startDate=...&endDate=...
 */
const getRevenueAnalytics = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const analytics = await providerService.getRevenueAnalytics(
      providerId as string,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json({
      success: true,
      message: "Revenue analytics retrieved successfully",
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Get top selling meals
 * GET /api/provider/analytics/:id/top-meals?limit=10
 */
const getTopSellingMeals = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const topMeals = await providerService.getTopSellingMeals(
      providerId as string,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Top selling meals retrieved successfully",
      data: topMeals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Update order status
 * PUT /api/provider/orders/:orderId/status
 * Body: { status: OrderStatus }
 */
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await providerService.updateOrderStatus(
      orderId as string,
      status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Cancel an order
 * PUT /api/provider/orders/:orderId/cancel
 */
const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const order = await providerService.cancelOrder(orderId as string);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Create a new meal
 * POST /api/provider/meals
 * Body: { name, description, price, image, categoryId, providerId, ... }
 */
const createMeal = async (req: Request, res: Response) => {
  try {
    const mealData = req.body;

    if (!mealData.name || !mealData.price || !mealData.categoryId || !mealData.providerId) {
      return res.status(400).json({
        success: false,
        message: "Name, price, categoryId, and providerId are required",
      });
    }

    const meal = await providerService.createMeal(mealData);

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Update an existing meal
 * PUT /api/provider/meals/:mealId
 * Body: { name?, description?, price?, ... }
 */
const updateMeal = async (req: Request, res: Response) => {
  try {
    const mealId = req.params.mealId;
    const mealData = req.body;

    const meal = await providerService.updateMeal(
      mealId as string,
      mealData
    );

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

/**
 * Delete a meal
 * DELETE /api/provider/meals/:mealId
 */
const deleteMeal = async (req: Request, res: Response) => {
  try {
    const mealId = req.params.mealId;
      const result = await providerService.deleteMeal(mealId as string);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

export const providerController = {
  // Stats & Dashboard
  getProviderStats,
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
  getRevenueAnalytics,
  getTopSellingMeals,

  // Orders
  getOrderByProviderId,
  updateOrderStatus,
  cancelOrder,

  // Meals
  getProviderMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};