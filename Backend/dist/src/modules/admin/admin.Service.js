import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
const getDashboardStats = async () => {
    try {
        const [totalOrders, totalRevenue, totalCustomers, totalProviders, totalMeals, totalCategories, pendingOrders, deliveredOrders, recentOrders,] = await Promise.all([
            // Total orders
            prisma.order.count(),
            // Total revenue (delivered orders only)
            prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { totalPrice: true },
            }),
            // Total customers
            prisma.user.count({
                where: { role: "USER" },
            }),
            // Total providers
            prisma.providerProfile.count(),
            // Total meals
            prisma.meal.count(),
            // Total categories
            prisma.category.count(),
            // Pending orders (PLACED + PREPARING)
            prisma.order.count({
                where: {
                    status: {
                        in: [OrderStatus.PLACED, OrderStatus.PREPARING],
                    },
                },
            }),
            // Delivered orders
            prisma.order.count({
                where: { status: OrderStatus.DELIVERED },
            }),
            // Recent orders
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    customer: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    provider: {
                        select: {
                            restaurant: true,
                        },
                    },
                },
            }),
        ]);
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalCustomers,
            totalProviders,
            totalMeals,
            totalCategories,
            pendingOrders,
            deliveredOrders,
            recentOrders: recentOrders.map((order) => ({
                id: order.id,
                customerName: order.customer.name,
                providerName: order.provider.restaurant || "Unknown",
                total: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt.toISOString(),
            })),
        };
    }
    catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error("Failed to fetch dashboard statistics");
    }
};
/**
 * Get all users with filtering
 */
const getAllUsers = async (role) => {
    try {
        const where = {};
        if (role && role !== "all") {
            where.role = role.toUpperCase();
        }
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                status: true,
                phone: true,
                createdAt: true,
                orders: {
                    select: {
                        id: true,
                        totalPrice: true,
                    },
                },
                providerProfile: {
                    select: {
                        restaurant: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
            role: user.role?.toLowerCase() || "customer",
            status: user.status?.toLowerCase() || "active",
            phone: user.phone,
            createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            ordersCount: user.orders.length,
            totalSpent: user.orders.reduce((sum, order) => sum + order.totalPrice, 0),
            restaurantName: user.providerProfile?.restaurant,
        }));
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
};
/**
 * Update user status
 */
const updateUserStatus = async (userId, status) => {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: status.toUpperCase() },
            select: {
                id: true,
                status: true,
            },
        });
        return {
            id: user.id,
            status: user.status?.toLowerCase() || "active",
        };
    }
    catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Failed to update user status");
    }
};
/**
 * Get all orders with filtering
 */
const getAllOrders = async (status) => {
    try {
        const where = {};
        if (status && status !== "all") {
            where.status = status.toUpperCase();
        }
        const orders = await prisma.order.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        restaurant: true,
                    },
                },
                items: {
                    include: {
                        meal: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return orders.map((order) => ({
            id: order.id,
            userId: order.customerId,
            userName: order.customer.name,
            userEmail: order.customer.email,
            userPhone: order.customer.phone || "N/A",
            providerId: order.providerId,
            providerName: order.provider.restaurant || "Unknown",
            status: order.status,
            deliveryAddress: order.deliveryAddress,
            items: order.items.map((item) => ({
                id: item.id,
                mealId: item.mealId,
                mealName: item.meal.name,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal: order.totalPrice,
            deliveryFee: 0,
            total: order.totalPrice,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.createdAt.toISOString(),
        }));
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
};
/**
 * Get all categories
 */
const getAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        meals: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            image: category.image,
            mealCount: category._count.meals,
            createdAt: category.createdAt.toISOString(),
        }));
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
    }
};
/**
 * Create a new category
 */
const createCategory = async (categoryData) => {
    try {
        const slug = categoryData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const category = await prisma.category.create({
            data: {
                id: `cat-${Date.now()}`,
                name: categoryData.name,
                slug: slug,
                icon: categoryData.icon || "🍽️",
                image: categoryData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
                mealCount: 0,
            },
        });
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            image: category.image,
            mealCount: 0,
            createdAt: category.createdAt.toISOString(),
        };
    }
    catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
    }
};
/**
 * Update a category
 */
const updateCategory = async (categoryId, categoryData) => {
    try {
        const updateData = { ...categoryData };
        if (categoryData.name) {
            updateData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: updateData,
            include: {
                _count: {
                    select: {
                        meals: true,
                    },
                },
            },
        });
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            image: category.image,
            mealCount: category._count.meals,
            createdAt: category.createdAt.toISOString(),
        };
    }
    catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
    }
};
/**
 * Delete a category
 */
const deleteCategory = async (categoryId) => {
    try {
        // Check if category has meals
        const mealsCount = await prisma.meal.count({
            where: { categoryId },
        });
        if (mealsCount > 0) {
            throw new Error("Cannot delete category with existing meals");
        }
        await prisma.category.delete({
            where: { id: categoryId },
        });
        return {
            id: categoryId,
            message: "Category deleted successfully",
        };
    }
    catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};
/**
 * Get all meals
 */
const getAllMeals = async () => {
    try {
        const meals = await prisma.meal.findMany({
            include: {
                category: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
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
            orderBy: {
                createdAt: "desc",
            },
        });
        return meals.map((meal) => {
            const avgRating = meal.reviews.length > 0
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
    }
    catch (error) {
        console.error("Error fetching meals:", error);
        throw new Error("Failed to fetch meals");
    }
};
export const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllOrders,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllMeals,
};
//# sourceMappingURL=admin.Service.js.map