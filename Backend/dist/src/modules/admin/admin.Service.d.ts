import { OrderStatus } from "../../../generated/prisma/enums";
export declare const adminService: {
    getDashboardStats: () => Promise<{
        totalOrders: number;
        totalRevenue: number;
        totalCustomers: number;
        totalProviders: number;
        totalMeals: number;
        totalCategories: number;
        pendingOrders: number;
        deliveredOrders: number;
        recentOrders: {
            id: string;
            customerName: string;
            providerName: string;
            total: number;
            status: OrderStatus;
            createdAt: string;
        }[];
    }>;
    getAllUsers: (role?: string) => Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
        status: string;
        phone: string | null;
        createdAt: string;
        ordersCount: number;
        totalSpent: number;
        restaurantName: string | null | undefined;
    }[]>;
    updateUserStatus: (userId: string, status: string) => Promise<{
        id: string;
        status: string;
    }>;
    getAllOrders: (status?: string) => Promise<{
        id: string;
        userId: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        providerId: string;
        providerName: string;
        status: OrderStatus;
        deliveryAddress: string;
        items: {
            id: string;
            mealId: string;
            mealName: string;
            quantity: number;
            price: number;
        }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    getAllCategories: () => Promise<{
        id: string;
        name: string;
        slug: string;
        icon: string;
        image: string;
        mealCount: number;
        createdAt: string;
    }[]>;
    createCategory: (categoryData: {
        name: string;
        icon: string;
        image: string;
    }) => Promise<{
        id: string;
        name: string;
        slug: string;
        icon: string;
        image: string;
        mealCount: number;
        createdAt: string;
    }>;
    updateCategory: (categoryId: string, categoryData: {
        name?: string;
        icon?: string;
        image?: string;
    }) => Promise<{
        id: string;
        name: string;
        slug: string;
        icon: string;
        image: string;
        mealCount: number;
        createdAt: string;
    }>;
    deleteCategory: (categoryId: string) => Promise<{
        id: string;
        message: string;
    }>;
    getAllMeals: () => Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        image: string;
        price: number;
        originalPrice: number;
        category: string;
        categoryId: string;
        providerId: string;
        providerName: string;
        rating: number;
        reviewCount: number;
        calories: number;
        prepTime: string;
        isVegetarian: boolean;
        isSpicy: boolean;
        isPopular: boolean;
        available: boolean;
        ingredients: string[];
        createdAt: string;
    }[]>;
};
//# sourceMappingURL=admin.Service.d.ts.map