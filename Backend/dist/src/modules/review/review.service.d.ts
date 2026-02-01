export declare const reviewService: {
    getCustomerOrders: (customerId: string) => Promise<{
        id: string;
        customerId: string;
        providerId: string;
        totalPrice: number;
        deliveryAddress: string;
        status: import("../../../generated/prisma/enums").OrderStatus;
        createdAt: Date;
        provider: {
            id: string;
            name: string | null;
            image: string | null;
        };
        items: {
            id: string;
            name: string;
            quantity: number;
            price: number;
            mealId: string;
            image: string | null;
        }[];
        _count: {
            items: number;
        };
        review: {
            id: string;
            rating: number;
            createdAt: Date;
            userId: string;
            mealId: string;
            comment: string | null;
        } | null;
    }[]>;
    getOrderById: (orderId: string) => Promise<({
        customer: {
            phone: string | null;
            id: string;
            name: string;
            email: string;
        };
        provider: {
            phone: string | null;
            id: string;
            name: string | null;
            image: string | null;
            address: string | null;
        };
        items: ({
            meal: {
                id: string;
                name: string;
                description: string | null;
                image: string | null;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            mealId: string;
            orderId: string;
        })[];
    } & {
        status: import("../../../generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        totalPrice: number;
        deliveryAddress: string;
        customerId: string;
        providerId: string;
    }) | null>;
    createOrder: (data: {
        customerId: string;
        providerId: string;
        items: Array<{
            mealId: string;
            quantity: number;
            price: number;
        }>;
        totalPrice: number;
        deliveryAddress: string;
    }) => Promise<{
        provider: {
            id: string;
            name: string | null;
            image: string | null;
        };
        items: ({
            meal: {
                id: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            mealId: string;
            orderId: string;
        })[];
    } & {
        status: import("../../../generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        totalPrice: number;
        deliveryAddress: string;
        customerId: string;
        providerId: string;
    }>;
    updateOrderStatus: (orderId: string, status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED") => Promise<{
        provider: {
            id: string;
            name: string | null;
        };
    } & {
        status: import("../../../generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        totalPrice: number;
        deliveryAddress: string;
        customerId: string;
        providerId: string;
    }>;
    addOrderReview: (data: {
        orderId: string;
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
    updateOrderReview: (reviewId: string, data: {
        rating?: number;
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
    deleteOrderReview: (reviewId: string) => Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        userId: string;
        mealId: string;
        comment: string | null;
    }>;
    getProviderOrders: (providerId: string) => Promise<({
        customer: {
            phone: string | null;
            id: string;
            name: string;
            email: string;
        };
        items: ({
            meal: {
                id: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            mealId: string;
            orderId: string;
        })[];
    } & {
        status: import("../../../generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        totalPrice: number;
        deliveryAddress: string;
        customerId: string;
        providerId: string;
    })[]>;
};
//# sourceMappingURL=review.service.d.ts.map