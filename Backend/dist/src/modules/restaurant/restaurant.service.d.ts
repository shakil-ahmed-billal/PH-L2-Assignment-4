export declare const restaurantService: {
    getAllRestaurant: () => Promise<({
        _count: {
            meals: number;
            orders: number;
        };
    } & {
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
    })[]>;
    getRestaurantById: (providerId: string) => Promise<({
        user: {
            id: string;
            name: string;
            image: string | null;
            email: string;
        };
        _count: {
            meals: number;
            orders: number;
        };
    } & {
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
    }) | null>;
    getRestaurantMeals: (providerId: string) => Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            icon: string;
        };
        _count: {
            reviews: number;
            orderItems: number;
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
    getRestaurantReviews: (providerId: string) => Promise<({
        user: {
            id: string;
            name: string;
            image: string | null;
        };
        meal: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        userId: string;
        mealId: string;
        comment: string | null;
    })[]>;
    updateRestaurant: (providerId: string, data: {
        name?: string;
        description?: string;
        image?: string;
        coverImage?: string;
        address?: string;
        phone?: string;
        deliveryTime?: string;
        deliveryFee?: number;
        minOrder?: number;
        cuisine?: string[];
        isOpen?: boolean;
    }) => Promise<{
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
    getRestaurantStats: (providerId: string) => Promise<{
        totalOrders: number;
        totalRevenue: number;
        totalMeals: number;
        rating: number;
        reviewCount: number;
    }>;
};
//# sourceMappingURL=restaurant.service.d.ts.map