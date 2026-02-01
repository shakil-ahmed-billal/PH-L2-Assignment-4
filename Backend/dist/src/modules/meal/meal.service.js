import { prisma } from "../../../lib/prisma";
/**
 * Get all meals with pagination and filters
 */
const getAllMealsWithPagination = async (filters) => {
    try {
        const { search, categoryId, isVegetarian, isSpicy, isPopular, minPrice, maxPrice, sort = "popular", page = 1, limit = 12, } = filters;
        // Build where clause
        const where = {
            available: true,
        };
        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { ingredients: { hasSome: [search] } },
            ];
        }
        // Category filter
        if (categoryId) {
            if (Array.isArray(categoryId)) {
                where.categoryId = { in: categoryId };
            }
            else {
                where.categoryId = categoryId;
            }
        }
        // Dietary filters
        if (isVegetarian !== undefined) {
            where.isVegetarian = isVegetarian;
        }
        if (isSpicy !== undefined) {
            where.isSpicy = isSpicy;
        }
        if (isPopular !== undefined) {
            where.isPopular = isPopular;
        }
        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        // Build orderBy clause
        let orderBy = {};
        switch (sort) {
            case "price-low":
                orderBy = { price: "asc" };
                break;
            case "price-high":
                orderBy = { price: "desc" };
                break;
            case "rating":
                // For rating, we'll need to calculate from reviews
                orderBy = { createdAt: "desc" }; // Fallback for now
                break;
            case "newest":
                orderBy = { createdAt: "desc" };
                break;
            case "popular":
            default:
                orderBy = { isPopular: "desc" };
                break;
        }
        // Calculate skip for pagination
        const skip = (page - 1) * limit;
        // Get total count
        const total = await prisma.meal.count({ where });
        // Get meals with pagination
        const meals = await prisma.meal.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        orderItems: true,
                    },
                },
            },
            orderBy,
            skip,
            take: limit,
        });
        // Calculate average rating for each meal
        const mealsWithRatings = await Promise.all(meals.map(async (meal) => {
            const reviews = await prisma.review.findMany({
                where: { mealId: meal.id },
                select: { rating: true },
            });
            const avgRating = reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            return {
                ...meal,
                rating: avgRating,
                reviewCount: reviews.length,
            };
        }));
        return {
            meals: mealsWithRatings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    catch (err) {
        console.error("Error in getAllMealsWithPagination:", err);
        throw new Error("Error fetching meals");
    }
};
/**
 * Get all meals (old function for backward compatibility)
 */
const getAllMeals = async (filters) => {
    try {
        const where = {
            available: true,
        };
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters?.providerId) {
            where.providerId = filters.providerId;
        }
        if (filters?.isVegetarian !== undefined) {
            where.isVegetarian = filters.isVegetarian;
        }
        if (filters?.isSpicy !== undefined) {
            where.isSpicy = filters.isSpicy;
        }
        if (filters?.isPopular !== undefined) {
            where.isPopular = filters.isPopular;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
        }
        const meals = await prisma.meal.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        rating: true,
                        address: true,
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
        throw new Error("Error fetching meals");
    }
};
/**
 * Get meal by ID with full details
 */
const getMealById = async (mealId) => {
    if (!mealId) {
        throw new Error("Meal ID is missing");
    }
    try {
        const meal = await prisma.meal.findUnique({
            where: {
                id: mealId,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        icon: true,
                        image: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                        rating: true,
                        reviewCount: true,
                        address: true,
                        deliveryTime: true,
                        deliveryFee: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        orderItems: true,
                    },
                },
            },
        });
        if (!meal)
            return null;
        // Get average rating
        const reviews = await prisma.review.findMany({
            where: { mealId: meal.id },
            select: { rating: true },
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        return {
            ...meal,
            rating: avgRating,
            reviewCount: reviews.length,
        };
    }
    catch (err) {
        throw new Error("Error fetching meal details");
    }
};
/**
 * Get reviews for a specific meal
 */
const getMealReviews = async (mealId) => {
    if (!mealId) {
        throw new Error("Meal ID is missing");
    }
    try {
        const reviews = await prisma.review.findMany({
            where: {
                mealId: mealId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return reviews;
    }
    catch (err) {
        throw new Error("Error fetching meal reviews");
    }
};
/**
 * Get related meals from the same provider
 */
const getRelatedMeals = async (mealId) => {
    if (!mealId) {
        throw new Error("Meal ID is missing");
    }
    try {
        const meal = await prisma.meal.findUnique({
            where: { id: mealId },
            select: { providerId: true },
        });
        if (!meal) {
            throw new Error("Meal not found");
        }
        const relatedMeals = await prisma.meal.findMany({
            where: {
                providerId: meal.providerId,
                available: true,
                id: {
                    not: mealId,
                },
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
                provider: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            take: 4,
            orderBy: {
                createdAt: "desc",
            },
        });
        return relatedMeals;
    }
    catch (err) {
        throw new Error("Error fetching related meals");
    }
};
/**
 * Create a new meal (Provider only)
 */
const createMeal = async (data) => {
    try {
        const newMeal = await prisma.meal.create({
            data: {
                ...data,
                originalPrice: data.originalPrice ? Number(data.originalPrice) : 0,
            },
            include: {
                category: true,
                provider: true,
            },
        });
        return newMeal;
    }
    catch (err) {
        throw new Error("Error creating meal");
    }
};
/**
 * Update meal (Provider only)
 */
const updateMeal = async (mealId, data) => {
    if (!mealId) {
        throw new Error("Meal ID is missing");
    }
    try {
        const updatedMeal = await prisma.meal.update({
            where: {
                id: mealId,
            },
            data: data,
            include: {
                category: true,
                provider: true,
            },
        });
        return updatedMeal;
    }
    catch (err) {
        throw new Error("Error updating meal");
    }
};
/**
 * Delete meal (Provider only)
 */
const deleteMeal = async (mealId) => {
    if (!mealId) {
        throw new Error("Meal ID is missing");
    }
    try {
        const deletedMeal = await prisma.meal.update({
            where: {
                id: mealId,
            },
            data: {
                available: false,
            },
        });
        return deletedMeal;
    }
    catch (err) {
        throw new Error("Error deleting meal");
    }
};
/**
 * Add review to meal
 */
const addMealReview = async (data) => {
    try {
        const review = await prisma.review.create({
            data: data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        return review;
    }
    catch (err) {
        throw new Error("Error adding review");
    }
};
export const mealService = {
    getAllMeals,
    getAllMealsWithPagination,
    getMealById,
    getMealReviews,
    getRelatedMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    addMealReview,
};
//# sourceMappingURL=meal.service.js.map