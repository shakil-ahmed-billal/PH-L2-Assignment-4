import { prisma } from "../../../lib/prisma";

/**
 * Get all orders for a customer
 */
const getCustomerOrders = async (customerId: string) => {
    if (!customerId) {
      throw new Error("Customer ID is missing");
    }
  
    try {
      const orders = await prisma.order.findMany({
        where: {
          customerId,
        },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          items: {
            include: {
              meal: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  providerId: true,
                },
              },
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      const ordersWithFilteredReviews = await Promise.all(
        orders.map(async (order) => {
          // 1️⃣ order items transform
          const transformedItems = order.items.map((item) => ({
            id: item.id,
            name: item.meal.name,
            quantity: item.quantity,
            price: item.price,
            mealId: item.mealId,
            image: item.meal.image,
          }));
  
          // 2️⃣ collect all mealIds from this order
          const mealIds = transformedItems.map((item) => item.mealId);
  
          // 3️⃣ find review ONLY if mealId matches
          const review = await prisma.review.findFirst({
            where: {
              userId: customerId,
              mealId: {
                in: mealIds,
              },
              createdAt: {
                gte: order.createdAt,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
  
          return {
            id: order.id,
            customerId: order.customerId,
            providerId: order.providerId,
            totalPrice: order.totalPrice,
            deliveryAddress: order.deliveryAddress,
            status: order.status,
            createdAt: order.createdAt,
            provider: order.provider,
            items: transformedItems,
            _count: order._count,
            review: review || null, // ✅ IMPORTANT
          };
        })
      );
  
      return ordersWithFilteredReviews;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching customer orders");
    }
  };
  

/**
 * Get order by ID
 */
const getOrderById = async (orderId: string) => {
  if (!orderId) {
    throw new Error("Order ID is missing");
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            address: true,
            phone: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return order;
  } catch (err) {
    throw new Error("Error fetching order details");
  }
};

/**
 * Create a new order
 */
const createOrder = async (data: {
  customerId: string;
  providerId: string;
  items: Array<{ mealId: string; quantity: number; price: number }>;
  totalPrice: number;
  deliveryAddress: string;
}) => {
  try {
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        providerId: data.providerId,
        totalPrice: data.totalPrice,
        deliveryAddress: data.deliveryAddress,
        status: "PLACED",
        items: {
          create: data.items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return order;
  } catch (err) {
    throw new Error("Error creating order");
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (
  orderId: string,
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED"
) => {
  if (!orderId) {
    throw new Error("Order ID is missing");
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedOrder;
  } catch (err) {
    throw new Error("Error updating order status");
  }
};

/**
 * Add review for an order
 */
const addOrderReview = async (data: {
  orderId: string;
  userId: string;
  rating: number;
  comment?: string;
}) => {
  try {
    // Get the order to find the provider and a meal
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        items: {
          take: 1,
          select: {
            mealId: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "DELIVERED") {
      throw new Error("Can only review delivered orders");
    }

    const mealId = order.items[0]?.mealId;
    if (!mealId) {
      throw new Error("No meals found in order");
    }

    // Create review for the meal
    const review = await prisma.review.create({
      data: {
        userId: data.userId,
        mealId: mealId,
        rating: data.rating,
        comment: data.comment ?? null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return review;
  } catch (err: any) {
    throw new Error(err.message || "Error adding review");
  }
};

/**
 * Update an existing review
 */
const updateOrderReview = async (
  reviewId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) => {
  if (!reviewId) {
    throw new Error("Review ID is missing");
  }

  try {
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return updatedReview;
  } catch (err) {
    throw new Error("Error updating review");
  }
};

/**
 * Delete a review
 */
const deleteOrderReview = async (reviewId: string) => {
  if (!reviewId) {
    throw new Error("Review ID is missing");
  }

  try {
    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });


    return deletedReview;
  } catch (err) {
    throw new Error("Error deleting review");
  }
};

/**
 * Get provider orders
 */
const getProviderOrders = async (providerId: string) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (err) {
    throw new Error("Error fetching provider orders");
  }
};

export const reviewService = {
  getCustomerOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  addOrderReview,
  updateOrderReview,
  deleteOrderReview,
  getProviderOrders,
};