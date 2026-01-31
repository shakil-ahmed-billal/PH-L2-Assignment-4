



//provider meal get by id service

import { prisma } from "../../../lib/prisma";

const getProviderMealByIdService = async (providerId: string) => {

    if(providerId === ''){
        throw new Error('Invalid provider id');
    }

    try{
        const result = await prisma.meal.findMany({
            where: {
                providerId: providerId
            }
        });

        return result
    }catch(error){
        throw error;
    }
}


const getOrderByProviderId = async (providerId: string) => {
  if (providerId === '') {
    throw new Error('Invalid provider id');
  }

  try {
    // Query the orders for the given providerId
    const orders = await prisma.order.findMany({
      where: {
        providerId: providerId, // Filter by providerId
      },
      include: {
        customer: true, // Include customer details
        provider: true, // Include provider details
        items: {
          include: {
            meal: true, 
          },
        },
      },
    });


    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.customer.id,
      userName: order.customer.name,
      userEmail: order.customer.email,
      userPhone: order.customer.phone,
      items: order.items.map((item) => ({
        mealId: item.meal.id,
        mealName: item.meal.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      deliveryFee: 2.99,
      total: order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 2.99, 
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: "cash",
      providerId: order.providerId,
      providerName: order.provider.restaurant ,
      createdAt: order.createdAt.toISOString(),
    //   updatedAt: order.updatedAt.toISOString() || null,
      updatedAt: new Date(),
    }));

    return formattedOrders;
  } catch (error) {
    throw error; 
  }
};


export const providerService = {
    getProviderMealByIdService,
    getOrderByProviderId
}