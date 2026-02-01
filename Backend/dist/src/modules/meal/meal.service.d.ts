interface MealFilters {
    search?: string | undefined;
    categoryId?: string | string[] | undefined;
    isVegetarian?: boolean | undefined;
    isSpicy?: boolean | undefined;
    isPopular?: boolean | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    sort?: "popular" | "price-low" | "price-high" | "rating" | "newest" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}
export declare const mealService: {
    getAllMeals: (filters?: {
        categoryId?: string;
        providerId?: string;
        isVegetarian?: boolean;
        isSpicy?: boolean;
        isPopular?: boolean;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
    }) => Promise<({
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
        provider: {
            id: string;
            name: string | null;
            image: string | null;
            rating: number;
            address: string | null;
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
    getAllMealsWithPagination: (filters: MealFilters) => Promise<{
        meals: {
            rating: number;
            reviewCount: number;
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
            provider: {
                id: string;
                name: string | null;
                image: string | null;
                rating: number;
            };
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
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMealById: (mealId: string) => Promise<{
        rating: number;
        reviewCount: number;
        category: {
            id: string;
            name: string;
            slug: string;
            image: string;
            icon: string;
        };
        _count: {
            reviews: number;
            orderItems: number;
        };
        provider: {
            id: string;
            name: string | null;
            slug: string | null;
            image: string | null;
            rating: number;
            reviewCount: number;
            deliveryTime: string;
            deliveryFee: number;
            address: string | null;
        };
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
    } | null>;
    getMealReviews: (mealId: string) => Promise<({
        user: {
            id: string;
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
    })[]>;
    getRelatedMeals: (mealId: string) => Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            icon: string;
        };
        provider: {
            id: string;
            name: string | null;
            image: string | null;
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
    createMeal: (data: {
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
    }) => Promise<{
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
    }>;
    updateMeal: (mealId: string, data: {
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
    }) => Promise<{
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
    }>;
    deleteMeal: (mealId: string) => Promise<{
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
    }>;
    addMealReview: (data: {
        mealId: string;
        userId: string;
        rating: number;
        comment?: string;
    }) => Promise<{
        user: {
            id: string;
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
    }>;
};
export {};
//# sourceMappingURL=meal.service.d.ts.map