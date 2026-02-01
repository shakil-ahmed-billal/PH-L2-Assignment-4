import { OrderStatus } from "../../../generated/prisma/enums";
/**
 * Get all orders for a specific provider
 */
export declare const getOrderByProviderId: (providerId: string) => Promise<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userImage: string | null;
    providerId: string;
    status: OrderStatus;
    deliveryAddress: string;
    items: {
        id: string;
        mealId: string;
        mealName: string;
        quantity: number;
        price: number;
        image: string | null;
    }[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get a single order by ID
 */
export declare const getOrderById: (orderId: string) => Promise<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userImage: string | null;
    providerId: string;
    status: OrderStatus;
    deliveryAddress: string;
    items: {
        id: string;
        mealId: string;
        mealName: string;
        quantity: number;
        price: number;
        image: string | null;
    }[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    createdAt: string;
    updatedAt: string;
}>;
/**
 * Update order status
 */
export declare const updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{
    id: string;
    status: OrderStatus;
    updatedAt: string;
}>;
/**
 * Cancel an order
 */
export declare const cancelOrder: (orderId: string) => Promise<{
    id: string;
    status: OrderStatus;
    updatedAt: string;
}>;
/**
 * Get order statistics for a provider
 */
export declare const getProviderOrderStats: (providerId: string) => Promise<{
    totalOrders: number;
    placedOrders: number;
    preparingOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
}>;
/**
 * Get recent orders for a provider (last 7 days)
 */
export declare const getRecentOrders: (providerId: string, days?: number) => Promise<({
    customer: {
        phone: string | null;
        name: string;
    };
    items: ({
        meal: {
            name: string;
        };
    } & {
        id: string;
        quantity: number;
        price: number;
        mealId: string;
        orderId: string;
    })[];
} & {
    status: OrderStatus;
    id: string;
    createdAt: Date;
    totalPrice: number;
    deliveryAddress: string;
    customerId: string;
    providerId: string;
})[]>;
/**
 * Get all meals for a specific provider
 */
export declare const getMealsByProviderId: (providerId: string) => Promise<{
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
/**
 * Get a single meal by ID
 */
export declare const getMealById: (mealId: string) => Promise<{
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
    reviews: ({
        user: {
            name: string;
            image: string | null;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        userId: string;
        mealId: string;
        comment: string | null;
    })[];
    createdAt: string;
}>;
/**
 * Create a new meal
 */
export declare const createMeal: (mealData: {
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
}) => Promise<{
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
}>;
/**
 * Update an existing meal
 */
export declare const updateMeal: (mealId: string, mealData: {
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
}) => Promise<{
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
}>;
/**
 * Delete a meal
 */
export declare const deleteMeal: (mealId: string) => Promise<{
    id: string;
    message: string;
}>;
/**
 * Toggle meal availability
 */
export declare const toggleMealAvailability: (mealId: string, available: boolean) => Promise<{
    id: string;
    available: boolean;
}>;
/**
 * Get meal statistics for a provider
 */
export declare const getProviderMealStats: (providerId: string) => Promise<{
    totalMeals: number;
    availableMeals: number;
    popularMeals: number;
    vegetarianMeals: number;
    spicyMeals: number;
    avgPrice: number;
    totalReviews: number;
    avgRating: number;
}>;
/**
 * Search meals by provider
 */
export declare const searchProviderMeals: (providerId: string, searchQuery: string) => Promise<({
    reviews: {
        rating: number;
    }[];
    category: {
        id: string;
        name: string;
        slug: string;
        image: string;
        createdAt: Date;
        icon: string;
        mealCount: number;
    };
    provider: {
        restaurant: string | null;
    };
} & {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    createdAt: Date;
    categoryId: string;
    available: boolean;
    providerId: string;
    price: number;
    originalPrice: import("@prisma/client/runtime/client").Decimal;
    calories: number | null;
    prepTime: string | null;
    isVegetarian: boolean;
    isSpicy: boolean;
    isPopular: boolean;
    ingredients: string[];
})[]>;
/**
 * Get comprehensive provider statistics
 * This combines both meal and order data for dashboard
 */
export declare const getProviderStats: (providerId: string) => Promise<{
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
/**
 * Get provider dashboard overview
 */
export declare const getProviderDashboard: (providerId: string) => Promise<{
    orders: {
        total: number;
        placed: number;
        preparing: number;
        ready: number;
        delivered: number;
        cancelled: number;
    };
    meals: {
        total: number;
        available: number;
        popular: number;
    };
    revenue: {
        total: number;
        monthly: number;
    };
    recentOrders: {
        id: string;
        customerName: string;
        customerPhone: string;
        status: OrderStatus;
        total: number;
        itemCount: number;
        createdAt: string;
    }[];
}>;
/**
 * Get provider profile with user info
 */
export declare const getProviderProfile: (providerId: string) => Promise<{
    phone: string | null;
    id: string;
    name: string | null;
    slug: string | null;
    description: string | null;
    image: string | null;
    coverImage: string | null;
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    cuisine: string[];
    isOpen: boolean;
    address: string | null;
    restaurant: string | null;
    createdAt: Date;
    userId: string;
}>;
/**
 * Update provider profile
 */
export declare const updateProviderProfile: (providerId: string, profileData: {
    restaurant?: string;
    description?: string;
    address?: string;
    phone?: string;
}) => Promise<{
    id: string;
    restaurant: string | null;
    description: string | null;
    address: string | null;
    phone: string | null;
    user: {
        id: string;
        name: string;
        email: string;
    };
}>;
/**
 * Get revenue analytics by date range
 */
export declare const getRevenueAnalytics: (providerId: string, startDate: Date, endDate: Date) => Promise<{
    totalRevenue: number;
    orderCount: number;
    revenueByDate: Record<string, number>;
}>;
/**
 * Get top selling meals
 */
export declare const getTopSellingMeals: (providerId: string, limit?: number) => Promise<{
    mealId: string;
    name: string;
    image: string | null | undefined;
    price: number;
    totalQuantity: number;
    orderCount: number;
    revenue: number;
}[]>;
export declare const providerService: {
    getMealsByProviderId: (providerId: string) => Promise<{
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
    getProviderStats: (providerId: string) => Promise<{
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
    getProviderDashboard: (providerId: string) => Promise<{
        orders: {
            total: number;
            placed: number;
            preparing: number;
            ready: number;
            delivered: number;
            cancelled: number;
        };
        meals: {
            total: number;
            available: number;
            popular: number;
        };
        revenue: {
            total: number;
            monthly: number;
        };
        recentOrders: {
            id: string;
            customerName: string;
            customerPhone: string;
            status: OrderStatus;
            total: number;
            itemCount: number;
            createdAt: string;
        }[];
    }>;
    getProviderProfile: (providerId: string) => Promise<{
        phone: string | null;
        id: string;
        name: string | null;
        slug: string | null;
        description: string | null;
        image: string | null;
        coverImage: string | null;
        rating: number;
        reviewCount: number;
        deliveryTime: string;
        deliveryFee: number;
        minOrder: number;
        cuisine: string[];
        isOpen: boolean;
        address: string | null;
        restaurant: string | null;
        createdAt: Date;
        userId: string;
    }>;
    updateProviderProfile: (providerId: string, profileData: {
        restaurant?: string;
        description?: string;
        address?: string;
        phone?: string;
    }) => Promise<{
        id: string;
        restaurant: string | null;
        description: string | null;
        address: string | null;
        phone: string | null;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    getRevenueAnalytics: (providerId: string, startDate: Date, endDate: Date) => Promise<{
        totalRevenue: number;
        orderCount: number;
        revenueByDate: Record<string, number>;
    }>;
    getTopSellingMeals: (providerId: string, limit?: number) => Promise<{
        mealId: string;
        name: string;
        image: string | null | undefined;
        price: number;
        totalQuantity: number;
        orderCount: number;
        revenue: number;
    }[]>;
    getOrderByProviderId: (providerId: string) => Promise<{
        id: string;
        userId: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        userImage: string | null;
        providerId: string;
        status: OrderStatus;
        deliveryAddress: string;
        items: {
            id: string;
            mealId: string;
            mealName: string;
            quantity: number;
            price: number;
            image: string | null;
        }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{
        id: string;
        status: OrderStatus;
        updatedAt: string;
    }>;
    cancelOrder: (orderId: string) => Promise<{
        id: string;
        status: OrderStatus;
        updatedAt: string;
    }>;
    createMeal: (mealData: {
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
    }) => Promise<{
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
    }>;
    updateMeal: (mealId: string, mealData: {
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
    }) => Promise<{
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
    }>;
    deleteMeal: (mealId: string) => Promise<{
        id: string;
        message: string;
    }>;
};
//# sourceMappingURL=provider.service.d.ts.map