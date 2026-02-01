import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

/**
 * Get all orders for a specific provider
 */
export const getOrderByProviderId = async (providerId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend Order interface
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.customerId,
      userName: order.customer.name,
      userEmail: order.customer.email,
      userPhone: order.customer.phone || "N/A",
      userImage: order.customer.image,
      providerId: order.providerId,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map((item) => ({
        id: item.id,
        mealId: item.mealId,
        mealName: item.meal.name,
        quantity: item.quantity,
        price: item.price,
        image: item.meal.image,
      })),
      subtotal: order.totalPrice,
      deliveryFee: 0, // Calculate if you have delivery fee logic
      total: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.createdAt.toISOString(),
    }));

    return transformedOrders;
  } catch (error) {
    console.error("Error fetching provider orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      id: order.id,
      userId: order.customerId,
      userName: order.customer.name,
      userEmail: order.customer.email,
      userPhone: order.customer.phone || "N/A",
      userImage: order.customer.image,
      providerId: order.providerId,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map((item) => ({
        id: item.id,
        mealId: item.mealId,
        mealName: item.meal.name,
        quantity: item.quantity,
        price: item.price,
        image: item.meal.image,
      })),
      subtotal: order.totalPrice,
      deliveryFee: 0,
      total: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            meal: true,
          },
        },
      },
    });

    return {
      id: order.id,
      status: order.status,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    return {
      id: order.id,
      status: order.status,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error("Failed to cancel order");
  }
};

/**
 * Get order statistics for a provider
 */
export const getProviderOrderStats = async (providerId: string) => {
  try {
    const [
      totalOrders,
      placedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count({
        where: { providerId },
      }),
      prisma.order.count({
        where: { providerId, status: OrderStatus.PLACED },
      }),
      prisma.order.count({
        where: { providerId, status: OrderStatus.PREPARING },
      }),
      prisma.order.count({
        where: { providerId, status: OrderStatus.READY },
      }),
      prisma.order.count({
        where: { providerId, status: OrderStatus.DELIVERED },
      }),
      prisma.order.count({
        where: { providerId, status: OrderStatus.CANCELLED },
      }),
      prisma.order.aggregate({
        where: { 
          providerId,
          status: OrderStatus.DELIVERED 
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalOrders,
      placedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw new Error("Failed to fetch order statistics");
  }
};

/**
 * Get recent orders for a provider (last 7 days)
 */
export const getRecentOrders = async (providerId: string, days: number = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        providerId: providerId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
};


/**
 * Get all meals for a specific provider
 */
export const getMealsByProviderId = async (providerId: string) => {
  try {
    const meals = await prisma.meal.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        provider: {
          select: {
            id: true,
            restaurant: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend Meal interface
    const transformedMeals = meals.map((meal) => {
      const avgRating =
        meal.reviews.length > 0
          ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) /
            meal.reviews.length
          : 0;

      return {
        id: meal.id,
        name: meal.name,
        slug: meal.slug,
        description: meal.description || "",
        image: meal.image || "",
        price: meal.price,
        originalPrice: Number(meal.originalPrice),
        category: meal.category.name,
        categoryId: meal.categoryId,
        providerId: meal.providerId,
        providerName: meal.provider.restaurant || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        reviewCount: meal.reviews.length,
        calories: meal.calories || 0,
        prepTime: meal.prepTime || "15-20 min",
        isVegetarian: meal.isVegetarian,
        isSpicy: meal.isSpicy,
        isPopular: meal.isPopular,
        available: meal.available,
        ingredients: meal.ingredients,
        createdAt: meal.createdAt.toISOString(),
      };
    });

    return transformedMeals;
  } catch (error) {
    console.error("Error fetching provider meals:", error);
    throw new Error("Failed to fetch meals");
  }
};

/**
 * Get a single meal by ID
 */
export const getMealById = async (mealId: string) => {
  try {
    const meal = await prisma.meal.findUnique({
      where: {
        id: mealId,
      },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            restaurant: true,
            address: true,
            phone: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!meal) {
      throw new Error("Meal not found");
    }

    const avgRating =
      meal.reviews.length > 0
        ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) /
          meal.reviews.length
        : 0;

    return {
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description || "",
      image: meal.image || "",
      price: meal.price,
      originalPrice: Number(meal.originalPrice),
      category: meal.category.name,
      categoryId: meal.categoryId,
      providerId: meal.providerId,
      providerName: meal.provider.restaurant || "Unknown",
      rating: Number(avgRating.toFixed(1)),
      reviewCount: meal.reviews.length,
      calories: meal.calories || 0,
      prepTime: meal.prepTime || "15-20 min",
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
      available: meal.available,
      ingredients: meal.ingredients,
      reviews: meal.reviews,
      createdAt: meal.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching meal:", error);
    throw new Error("Failed to fetch meal");
  }
};

/**
 * Create a new meal
 */
export const createMeal = async (mealData: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  categoryId: string;
  providerId: string;
  calories?: number;
  prepTime?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  ingredients?: string[];
}) => {
  try {
    // Generate slug from name
    const slug = mealData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const meal = await prisma.meal.create({
      data: {
        name: mealData.name,
        slug: slug,
        description: mealData.description ?? null,
        price: mealData.price,
        originalPrice: mealData.originalPrice || 0,
        image: mealData.image ?? null,
        categoryId: mealData.categoryId,
        providerId: mealData.providerId,
        calories: mealData.calories ?? null,
        prepTime: mealData.prepTime ?? null,
        isVegetarian: mealData.isVegetarian || false,
        isSpicy: mealData.isSpicy || false,
        isPopular: mealData.isPopular || false,
        ingredients: mealData.ingredients || [],
        available: true,
      },
      include: {
        category: true,
        provider: {
          select: {
            restaurant: true,
          },
        },
      },
    });

    const mealWithRelations = meal as typeof meal & { category: { name: string }; provider: { restaurant: string | null } };
    return {
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description || "",
      image: meal.image || "",
      price: meal.price,
      originalPrice: Number(meal.originalPrice),
      category: mealWithRelations.category.name,
      categoryId: meal.categoryId,
      providerId: meal.providerId,
      providerName: mealWithRelations.provider.restaurant || "Unknown",
      rating: 0,
      reviewCount: 0,
      calories: meal.calories || 0,
      prepTime: meal.prepTime || "15-20 min",
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
      available: meal.available,
      ingredients: meal.ingredients,
      createdAt: meal.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error creating meal:", error);
    throw new Error("Failed to create meal");
  }
};

/**
 * Update an existing meal
 */
export const updateMeal = async (
  mealId: string,
  mealData: {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    categoryId?: string;
    calories?: number;
    prepTime?: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    isPopular?: boolean;
    available?: boolean;
    ingredients?: string[];
  }
) => {
  try {
    // If name is being updated, regenerate slug
    const updateData: any = { ...mealData };
    if (mealData.name) {
      updateData.slug = mealData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const meal = await prisma.meal.update({
      where: {
        id: mealId,
      },
      data: updateData,
      include: {
        category: true,
        provider: {
          select: {
            restaurant: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const avgRating =
      meal.reviews.length > 0
        ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) /
          meal.reviews.length
        : 0;

    return {
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description || "",
      image: meal.image || "",
      price: meal.price,
      originalPrice: Number(meal.originalPrice),
      category: meal.category.name,
      categoryId: meal.categoryId,
      providerId: meal.providerId,
      providerName: meal.provider.restaurant || "Unknown",
      rating: Number(avgRating.toFixed(1)),
      reviewCount: meal.reviews.length,
      calories: meal.calories || 0,
      prepTime: meal.prepTime || "15-20 min",
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
      available: meal.available,
      ingredients: meal.ingredients,
      createdAt: meal.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error updating meal:", error);
    throw new Error("Failed to update meal");
  }
};

/**
 * Delete a meal
 */
export const deleteMeal = async (mealId: string) => {
  try {
    // Check if meal has any orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        mealId: mealId,
      },
    });

    if (orderItems.length > 0) {
      // Instead of deleting, mark as unavailable
      await prisma.meal.update({
        where: {
          id: mealId,
        },
        data: {
          available: false,
        },
      });

      return {
        id: mealId,
        message: "Meal marked as unavailable (has existing orders)",
      };
    } else {
      // Safe to delete
      await prisma.meal.delete({
        where: {
          id: mealId,
        },
      });

      return {
        id: mealId,
        message: "Meal deleted successfully",
      };
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw new Error("Failed to delete meal");
  }
};

/**
 * Toggle meal availability
 */
export const toggleMealAvailability = async (
  mealId: string,
  available: boolean
) => {
  try {
    const meal = await prisma.meal.update({
      where: {
        id: mealId,
      },
      data: {
        available: available,
      },
    });

    return {
      id: meal.id,
      available: meal.available,
    };
  } catch (error) {
    console.error("Error toggling meal availability:", error);
    throw new Error("Failed to toggle meal availability");
  }
};

/**
 * Get meal statistics for a provider
 */
export const getProviderMealStats = async (providerId: string) => {
  try {
    const [
      totalMeals,
      availableMeals,
      popularMeals,
      vegetarianMeals,
      spicyMeals,
      avgPrice,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      prisma.meal.count({
        where: { providerId },
      }),
      prisma.meal.count({
        where: { providerId, available: true },
      }),
      prisma.meal.count({
        where: { providerId, isPopular: true },
      }),
      prisma.meal.count({
        where: { providerId, isVegetarian: true },
      }),
      prisma.meal.count({
        where: { providerId, isSpicy: true },
      }),
      prisma.meal.aggregate({
        where: { providerId },
        _avg: {
          price: true,
        },
      }),
      prisma.review.count({
        where: {
          meal: {
            providerId: providerId,
          },
        },
      }),
      prisma.review.aggregate({
        where: {
          meal: {
            providerId: providerId,
          },
        },
        _avg: {
          rating: true,
        },
      }),
    ]);

    return {
      totalMeals,
      availableMeals,
      popularMeals,
      vegetarianMeals,
      spicyMeals,
      avgPrice: avgPrice._avg.price || 0,
      totalReviews,
      avgRating: avgRating._avg.rating || 0,
    };
  } catch (error) {
    console.error("Error fetching meal stats:", error);
    throw new Error("Failed to fetch meal statistics");
  }
};

/**
 * Search meals by provider
 */
export const searchProviderMeals = async (
  providerId: string,
  searchQuery: string
) => {
  try {
    const meals = await prisma.meal.findMany({
      where: {
        providerId: providerId,
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
        provider: {
          select: {
            restaurant: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    return meals;
  } catch (error) {
    console.error("Error searching meals:", error);
    throw new Error("Failed to search meals");
  }
};

/**
 * Get comprehensive provider statistics
 * This combines both meal and order data for dashboard
 */
export const getProviderStats = async (providerId: string) => {
  try {
    // Get provider profile with meals
    const providerProfile = await prisma.providerProfile.findUnique({
      where: {
        id: providerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        meals: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!providerProfile) {
      throw new Error("Provider not found");
    }

    // Transform meals data
    const transformedMeals = providerProfile.meals.map((meal) => {
      const avgRating =
        meal.reviews.length > 0
          ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) /
            meal.reviews.length
          : 0;

      return {
        id: meal.id,
        name: meal.name,
        slug: meal.slug,
        description: meal.description || "",
        image: meal.image || "",
        price: meal.price,
        originalPrice: Number(meal.originalPrice),
        category: meal.category.name,
        categoryId: meal.categoryId,
        providerId: meal.providerId,
        providerName: providerProfile.restaurant || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        reviewCount: meal.reviews.length,
        calories: meal.calories || 0,
        prepTime: meal.prepTime || "15-20 min",
        isVegetarian: meal.isVegetarian,
        isSpicy: meal.isSpicy,
        isPopular: meal.isPopular,
        available: meal.available,
        ingredients: meal.ingredients,
        createdAt: meal.createdAt.toISOString(),
      };
    });

    return transformedMeals;
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    throw new Error("Failed to fetch provider statistics");
  }
};

/**
 * Get provider dashboard overview
 */
export const getProviderDashboard = async (providerId: string) => {
  try {
    const [
      // Order stats
      totalOrders,
      placedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      
      // Meal stats
      totalMeals,
      availableMeals,
      popularMeals,
      
      // Revenue stats
      totalRevenue,
      monthlyRevenue,
      
      // Recent orders
      recentOrders,
    ] = await Promise.all([
      // Order counts
      prisma.order.count({ where: { providerId } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.PLACED } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.PREPARING } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.READY } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.CANCELLED } }),
      
      // Meal counts
      prisma.meal.count({ where: { providerId } }),
      prisma.meal.count({ where: { providerId, available: true } }),
      prisma.meal.count({ where: { providerId, isPopular: true } }),
      
      // Revenue calculations
      prisma.order.aggregate({
        where: { 
          providerId,
          status: OrderStatus.DELIVERED 
        },
        _sum: { totalPrice: true },
      }),
      prisma.order.aggregate({
        where: { 
          providerId,
          status: OrderStatus.DELIVERED,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalPrice: true },
      }),
      
      // Recent orders (last 10)
      prisma.order.findMany({
        where: { providerId },
        include: {
          customer: {
            select: {
              name: true,
              phone: true,
            },
          },
          items: {
            select: {
              quantity: true,
              meal: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return {
      orders: {
        total: totalOrders,
        placed: placedOrders,
        preparing: preparingOrders,
        ready: readyOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      meals: {
        total: totalMeals,
        available: availableMeals,
        popular: popularMeals,
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
        monthly: monthlyRevenue._sum.totalPrice || 0,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customer.name,
        customerPhone: order.customer.phone || "N/A",
        status: order.status,
        total: order.totalPrice,
        itemCount: order.items.length,
        createdAt: order.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching provider dashboard:", error);
    throw new Error("Failed to fetch provider dashboard");
  }
};

/**
 * Get provider profile with user info
 */
export const getProviderProfile = async (providerId: string) => {
  try {
    const provider = await prisma.providerProfile.findUnique({
      where:{
        userId: providerId
      }
    });
    console.log(provider);

    if (!provider) {
      throw new Error("Provider not found");
    }


    return provider
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    throw new Error("Failed to fetch provider profile");
  }
};

/**
 * Update provider profile
 */
export const updateProviderProfile = async (
  providerId: string,
  profileData: {
    restaurant?: string;
    description?: string;
    address?: string;
    phone?: string;
  }
) => {
  try {
    const provider = await prisma.providerProfile.update({
      where: {
        id: providerId,
      },
      data: profileData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      id: provider.id,
      restaurant: provider.restaurant,
      description: provider.description,
      address: provider.address,
      phone: provider.phone,
      user: provider.user,
    };
  } catch (error) {
    console.error("Error updating provider profile:", error);
    throw new Error("Failed to update provider profile");
  }
};

/**
 * Get revenue analytics by date range
 */
export const getRevenueAnalytics = async (
  providerId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId,
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    // Group by date
    const revenueByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split("T")[0] ?? "";
      if (date) {
        const current = acc[date] ?? 0;
        acc[date] = current + order.totalPrice;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      orderCount: orders.length,
      revenueByDate,
    };
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    throw new Error("Failed to fetch revenue analytics");
  }
};

/**
 * Get top selling meals
 */
export const getTopSellingMeals = async (
  providerId: string,
  limit: number = 10
) => {
  try {
    const topMeals = await prisma.orderItem.groupBy({
      by: ["mealId"],
      where: {
        meal: {
          providerId: providerId,
        },
      },
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    // Get meal details
    const mealIds = topMeals.map((item) => item.mealId);
    const meals = await prisma.meal.findMany({
      where: {
        id: {
          in: mealIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
      },
    });

    // Combine data
    const topSellingMeals = topMeals.map((item) => {
      const meal = meals.find((m) => m.id === item.mealId);
      return {
        mealId: item.mealId,
        name: meal?.name || "Unknown",
        image: meal?.image,
        price: meal?.price || 0,
        totalQuantity: item._sum.quantity || 0,
        orderCount: item._count.id,
        revenue: (item._sum.quantity || 0) * (meal?.price || 0),
      };
    });

    return topSellingMeals;
  } catch (error) {
    console.error("Error fetching top selling meals:", error);
    throw new Error("Failed to fetch top selling meals");
  }
};


export const providerService = {
  getMealsByProviderId,
  getProviderStats,
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
  getRevenueAnalytics,
  getTopSellingMeals,
  getOrderByProviderId,
  updateOrderStatus,
  cancelOrder,
  createMeal,
  updateMeal,
  deleteMeal,
};