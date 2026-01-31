



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

  const findProvider =await prisma.providerProfile.findUnique({
    where: {
      userId: providerId,
    },
  });
  if (!findProvider) {
    throw new Error('Provider not found');
  }

  try {
    // Query the orders for the given providerId
    const orders = await prisma.order.findMany({
      where: {
        providerId: findProvider.id, // Filter by providerId
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


const getProviderStats = async (providerId: string) => {
  if (providerId === '') {
    throw new Error('Invalid provider id');
  }

  try {
    // Get today's date for revenue and orders
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Reset time to midnight for today's date

    // Fetch total revenue for today
    const revenue = await prisma.order.aggregate({
      where: {
        providerId: providerId,
        status: 'DELIVERED', // Only completed orders count towards revenue
      },
      _sum: {
        totalPrice: true,
      },
    });

    // Fetch total orders count
    const totalOrders = await prisma.order.count({
      where: {
        providerId: providerId,
      },
    });

    // Fetch pending orders count (status 'PREPARING' or 'PLACED')
    const pendingOrders = await prisma.order.count({
      where: {
        providerId: providerId,
        status: {
          in: ['PREPARING', 'PLACED'],
        },
      },
    });

    // Fetch total menu items (meals) for the provider
    const providerMeals = await prisma.meal.count({
      where: {
        providerId: providerId,
        available: true, // You can modify this based on whether you want to count active meals only
      },
    });

    // Return the stats in the required format
    const stats = [
      {
        title: "Today's Revenue",
        value: `$${revenue._sum.totalPrice ? revenue._sum.totalPrice.toFixed(2) : "0.00"}`,
        change: "+18.2%", // You can calculate a percentage change based on previous data
        icon: "DollarSign", // Assuming you will use a component for the icon
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
      },
      {
        title: "Total Orders",
        value: totalOrders.toString(),
        change: "+12 today", // You can calculate daily change if needed
        icon: "ShoppingBag", // Assuming you will use a component for the icon
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Pending Orders",
        value: pendingOrders.toString(),
        change: "Action needed", // You can calculate the action needed based on your business logic
        icon: "Clock", // Assuming you will use a component for the icon
        color: "text-amber-600",
        bgColor: "bg-amber-100",
      },
      {
        title: "Menu Items",
        value: providerMeals.toString(),
        change: "Active items", // You can dynamically calculate this if needed
        icon: "UtensilsCrossed", // Assuming you will use a component for the icon
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
    ];

    return stats;

  } catch (error) {
    throw error;
  }
};



export const providerService = {
    getProviderMealByIdService,
    getOrderByProviderId,
    getProviderStats
}