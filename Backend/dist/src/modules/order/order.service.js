import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
const createNewOrder = async (data) => {
    try {
        if (!data) {
            throw new Error("Data not passed");
        }
        // Create the order
        const order = await prisma.order.create({
            data: {
                customerId: data.customerId,
                providerId: data.providerId,
                totalPrice: data.totalPrice,
                deliveryAddress: data.deliveryAddress,
                status: OrderStatus.PLACED, // Setting default status to PLACED
                items: {
                    create: data.items.map((item) => ({
                        mealId: item.mealId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            },
            include: {
                items: true // Include the related items in the response
            }
        });
        return order;
    }
    catch (err) {
        throw new Error(`${err}`);
    }
};
const getMyOrder = async (id) => {
    try {
        const result = await prisma.order.findMany({
            where: {
                customerId: id,
            },
            include: {
                items: {
                    include: {
                        meal: true,
                    },
                },
                provider: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (result.length === 0) {
            return [];
        }
        const formattedOrder = result.map((order) => ({
            id: order.id,
            date: order.createdAt.toISOString().split("T")[0],
            status: order.status.toLowerCase(),
            total: order.totalPrice,
            provider: order.provider.restaurant,
            items: order.items.map((item) => ({
                name: item.meal.name,
                quantity: item.quantity,
                price: item.price,
            })),
        }));
        return formattedOrder;
    }
    catch (err) {
        throw new Error(`Failed to fetch orders: ${String(err)}`);
    }
};
export const orderService = {
    createNewOrder,
    getMyOrder
};
//# sourceMappingURL=order.service.js.map