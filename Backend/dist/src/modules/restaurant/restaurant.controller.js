import { restaurantService } from "./restaurant.service";
/**
 * Get all restaurants
 * GET /api/restaurant
 */
const getAllRestaurant = async (req, res) => {
    try {
        const result = await restaurantService.getAllRestaurant();
        if (result) {
            res.status(200).send({
                success: true,
                message: "Restaurants fetched successfully",
                data: result,
            });
        }
    }
    catch (err) {
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
const getRestaurantById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({
            success: false,
            message: "Restaurant ID is required",
            data: null,
        });
    }
    try {
        const result = await restaurantService.getRestaurantById(id);
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
    }
    catch (error) {
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
const getRestaurantMeals = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({
            success: false,
            message: "Restaurant ID is required",
            data: null,
        });
    }
    try {
        const meals = await restaurantService.getRestaurantMeals(id);
        res.status(200).send({
            success: true,
            message: "Meals fetched successfully",
            data: meals,
        });
    }
    catch (error) {
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
const getRestaurantReviews = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({
            success: false,
            message: "Restaurant ID is required",
            data: null,
        });
    }
    try {
        const reviews = await restaurantService.getRestaurantReviews(id);
        res.status(200).send({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
        });
    }
    catch (error) {
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
const updateRestaurant = async (req, res) => {
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
        const updatedRestaurant = await restaurantService.updateRestaurant(id, updateData);
        res.status(200).send({
            success: true,
            message: "Restaurant updated successfully",
            data: updatedRestaurant,
        });
    }
    catch (error) {
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
const getRestaurantStats = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({
            success: false,
            message: "Restaurant ID is required",
            data: null,
        });
    }
    try {
        const stats = await restaurantService.getRestaurantStats(id);
        res.status(200).send({
            success: true,
            message: "Statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
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
//# sourceMappingURL=restaurant.controller.js.map