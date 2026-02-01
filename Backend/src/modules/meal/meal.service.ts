import { prisma } from "../../../lib/prisma";

/**
 * Get all meals with filters
 */
const getAllMeals = async (filters?: {
  categoryId?: string;
  providerId?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {

  try {
    // const where: any = {
    //   available: true,
    // };

    // if (filters?.categoryId) {
    //   where.categoryId = filters.categoryId;
    // }

    // if (filters?.providerId) {
    //   where.providerId = filters.providerId;
    // }

    // if (filters?.isVegetarian !== undefined) {
    //   where.isVegetarian = filters.isVegetarian;
    // }

    // if (filters?.isSpicy !== undefined) {
    //   where.isSpicy = filters.isSpicy;
    // }

    // if (filters?.isPopular !== undefined) {
    //   where.isPopular = filters.isPopular;
    // }

    // if (filters?.search) {
    //   where.OR = [
    //     { name: { contains: filters.search, mode: "insensitive" } },
    //     { description: { contains: filters.search, mode: "insensitive" } },
    //   ];
    // }

    // if (filters?.minPrice || filters?.maxPrice) {
    //   where.price = {};
    //   if (filters.minPrice) where.price.gte = filters.minPrice;
    //   if (filters.maxPrice) where.price.lte = filters.maxPrice;
    // }

    const meals = await prisma.meal.findMany();

    // {
    //   where,
    //   include: {
    //     category: {
    //       select: {
    //         id: true,
    //         name: true,
    //         slug: true,
    //         icon: true,
    //       },
    //     },
    //     provider: {
    //       select: {
    //         id: true,
    //         name: true,
    //         image: true,
    //         rating: true,
    //         address: true,
    //       },
    //     },
    //     _count: {
    //       select: {
    //         reviews: true,
    //         orderItems: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // }

    return meals
  } catch (err) {
    throw new Error("Error fetching meals");
  }
};

/**
 * Get meal by ID with full details
 */
const getMealById = async (mealId: string) => {
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

    return meal;
  } catch (err) {
    throw new Error("Error fetching meal details");
  }
};

/**
 * Get reviews for a specific meal
 */
const getMealReviews = async (mealId: string) => {
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
  } catch (err) {
    throw new Error("Error fetching meal reviews");
  }
};

/**
 * Get related meals from the same provider
 */
const getRelatedMeals = async (mealId: string) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }

  try {
    // First, get the meal to find its provider
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      select: { providerId: true },
    });

    if (!meal) {
      throw new Error("Meal not found");
    }

    // Then get other meals from the same provider
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
  } catch (err) {
    throw new Error("Error fetching related meals");
  }
};

/**
 * Create a new meal (Provider only)
 */
const createMeal = async (data: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  slug: string;
  calories?: number;
  prepTime?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  ingredients?: string[];
  providerId: string;
  categoryId: string;
}) => {
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
  } catch (err) {
    throw new Error("Error creating meal");
  }
};

/**
 * Update meal (Provider only)
 */
const updateMeal = async (
  mealId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    available?: boolean;
    calories?: number;
    prepTime?: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    isPopular?: boolean;
    ingredients?: string[];
  }
) => {
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
  } catch (err) {
    throw new Error("Error updating meal");
  }
};

/**
 * Delete meal (Provider only)
 */
const deleteMeal = async (mealId: string) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }

  try {
    // Soft delete - just mark as unavailable
    const deletedMeal = await prisma.meal.update({
      where: {
        id: mealId,
      },
      data: {
        available: false,
      },
    });

    return deletedMeal;
  } catch (err) {
    throw new Error("Error deleting meal");
  }
};

/**
 * Add review to meal
 */
const addMealReview = async (data: {
  mealId: string;
  userId: string;
  rating: number;
  comment?: string;
}) => {
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
  } catch (err) {
    throw new Error("Error adding review");
  }
};

export const mealService = {
  getAllMeals,
  getMealById,
  getMealReviews,
  getRelatedMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  addMealReview,
};