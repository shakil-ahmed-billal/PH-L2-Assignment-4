import { prisma } from "../../../lib/prisma";
/**
 * Get all restaurants with their meal count
 */
const getAllRestaurant = async () => {
    try {
        const result = await prisma.providerProfile.findMany({
            include: {
                _count: {
                    select: {
                        meals: true,
                        orders: true,
                    },
                },
            },
            orderBy: {
                rating: "desc",
            },
        });
        return result;
    }
    catch (err) {
        throw err;
    }
};
/**
 * Get restaurant by ID with full details
 */
const getRestaurantById = async (providerId) => {
    console.log(providerId, "provider id");
    if (!providerId) {
        throw new Error("Provider ID is missing");
    }
    try {
        const result = await prisma.providerProfile.findUnique({
            where: {
                id: providerId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        meals: true,
                        orders: true,
                    },
                },
            },
        });
        return result;
    }
    catch (err) {
        throw new Error("Fetch error while getting provider details");
    }
};
/**
 * Get all meals for a specific restaurant
 */
const getRestaurantMeals = async (providerId) => {
    if (!providerId) {
        throw new Error("Provider ID is missing");
    }
    try {
        const meals = await prisma.meal.findMany({
            where: {
                providerId: providerId,
                available: true,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        orderItems: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return meals;
    }
    catch (err) {
        throw new Error("Error fetching restaurant meals");
    }
};
/**
 * Get all reviews for a restaurant
 */
const getRestaurantReviews = async (providerId) => {
    if (!providerId) {
        throw new Error("Provider ID is missing");
    }
    try {
        // First, get all meal IDs for this provider
        const meals = await prisma.meal.findMany({
            where: {
                providerId: providerId,
            },
            select: {
                id: true,
            },
        });
        const mealIds = meals.map((meal) => meal.id);
        // Then get all reviews for these meals
        const reviews = await prisma.review.findMany({
            where: {
                mealId: {
                    in: mealIds,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                meal: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20, // Limit to recent 20 reviews
        });
        return reviews;
    }
    catch (err) {
        throw new Error("Error fetching restaurant reviews");
    }
};
/**
 * Update restaurant profile
 */
const updateRestaurant = async (providerId, data) => {
    if (!providerId) {
        throw new Error("Provider ID is missing");
    }
    try {
        const updatedRestaurant = await prisma.providerProfile.update({
            where: {
                id: providerId,
            },
            data: data,
        });
        return updatedRestaurant;
    }
    catch (err) {
        throw new Error("Error updating restaurant profile");
    }
};
/**
 * Get restaurant statistics
 */
const getRestaurantStats = async (providerId) => {
    if (!providerId) {
        throw new Error("Provider ID is missing");
    }
    try {
        // Get total orders
        const totalOrders = await prisma.order.count({
            where: {
                providerId: providerId,
            },
        });
        // Get total revenue
        const orders = await prisma.order.findMany({
            where: {
                providerId: providerId,
                status: "DELIVERED",
            },
            select: {
                totalPrice: true,
            },
        });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        // Get total meals
        const totalMeals = await prisma.meal.count({
            where: {
                providerId: providerId,
            },
        });
        // Get average rating
        const restaurant = await prisma.providerProfile.findUnique({
            where: {
                id: providerId,
            },
            select: {
                rating: true,
                reviewCount: true,
            },
        });
        return {
            totalOrders,
            totalRevenue,
            totalMeals,
            rating: restaurant?.rating || 0,
            reviewCount: restaurant?.reviewCount || 0,
        };
    }
    catch (err) {
        throw new Error("Error fetching restaurant statistics");
    }
};
export const restaurantService = {
    getAllRestaurant,
    getRestaurantById,
    getRestaurantMeals,
    getRestaurantReviews,
    updateRestaurant,
    getRestaurantStats,
};
//# sourceMappingURL=restaurant.service.js.map