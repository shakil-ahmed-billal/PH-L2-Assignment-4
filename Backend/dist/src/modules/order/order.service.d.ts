import { OrderStatus } from "../../../generated/prisma/enums";
export declare const orderService: {
    createNewOrder: (data: any) => Promise<{
        items: {
            id: string;
            quantity: number;
            price: number;
            mealId: string;
            orderId: string;
        }[];
    } & {
        status: OrderStatus;
        id: string;
        createdAt: Date;
        totalPrice: number;
        deliveryAddress: string;
        customerId: string;
        providerId: string;
    }>;
    getMyOrder: (id: string) => Promise<{
        id: string;
        date: string | undefined;
        status: string;
        total: number;
        provider: string | null;
        items: {
            name: string;
            quantity: number;
            price: number;
        }[];
    }[]>;
};
//# sourceMappingURL=order.service.d.ts.map