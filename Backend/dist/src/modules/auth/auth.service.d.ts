export declare const authService: {
    providerCreate: (payload: any) => Promise<{
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
};
//# sourceMappingURL=auth.service.d.ts.map