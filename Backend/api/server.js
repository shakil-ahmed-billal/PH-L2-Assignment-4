// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  role          String?   @default("USER")\n  phone         String?\n  status        String?   @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n\n  providerProfile ProviderProfile?\n  orders          Order[]\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel Meal {\n  id            String   @id @default(uuid())\n  name          String\n  description   String?\n  price         Float\n  originalPrice Decimal  @default(0)\n  image         String?\n  available     Boolean  @default(true)\n  slug          String\n  calories      Float?\n  prepTime      String?\n  isVegetarian  Boolean  @default(false)\n  isSpicy       Boolean  @default(false)\n  isPopular     Boolean  @default(false)\n  ingredients   String[]\n\n  providerId String\n  categoryId String\n\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n  category Category        @relation(fields: [categoryId], references: [id])\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n}\n\nmodel Category {\n  id        String @id\n  name      String\n  slug      String @unique\n  icon      String\n  image     String\n  mealCount Int    @map("meal_count")\n\n  createdAt DateTime @default(now())\n\n  meals Meal[]\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  customerId      String\n  providerId      String\n  totalPrice      Float\n  deliveryAddress String\n  status          OrderStatus @default(PLACED)\n\n  customer User            @relation(fields: [customerId], references: [id])\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  orderId  String\n  mealId   String\n  quantity Int\n  price    Float\n\n  order Order @relation(fields: [orderId], references: [id])\n  meal  Meal  @relation(fields: [mealId], references: [id])\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\n/**\n * {\n * id: "prov-1",\n * name: "Burger Palace",\n * slug: "burger-palace",\n * description: "Home of the juiciest burgers in town. Made with 100% premium beef and fresh ingredients.",\n * image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop",\n * coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=400&fit=crop",\n * rating: 4.8,\n * reviewCount: 1250,\n * deliveryTime: "25-35 min",\n * deliveryFee: 2.99,\n * minOrder: 15,\n * cuisine: ["American", "Fast Food", "Burgers"],\n * isOpen: true,\n * address: "123 Main Street, Downtown",\n * },\n */\n\nmodel ProviderProfile {\n  id           String   @id @default(uuid())\n  userId       String   @unique\n  name         String?\n  slug         String?\n  description  String?\n  image        String?\n  coverImage   String?\n  rating       Int      @default(0)\n  reviewCount  Int      @default(0)\n  deliveryTime String   @default("25-35 min")\n  deliveryFee  Int      @default(2)\n  minOrder     Int      @default(0)\n  cuisine      String[] @default([])\n  isOpen       Boolean  @default(true)\n  address      String?\n  restaurant   String?\n  phone        String?\n\n  user   User    @relation(fields: [userId], references: [id])\n  meals  Meal[]\n  orders Order[]\n\n  createdAt DateTime @default(now())\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String?\n\n  userId String\n  mealId String\n\n  user User @relation(fields: [userId], references: [id])\n  meal Meal @relation(fields: [mealId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"originalPrice","kind":"scalar","type":"Decimal"},{"name":"image","kind":"scalar","type":"String"},{"name":"available","kind":"scalar","type":"Boolean"},{"name":"slug","kind":"scalar","type":"String"},{"name":"calories","kind":"scalar","type":"Float"},{"name":"prepTime","kind":"scalar","type":"String"},{"name":"isVegetarian","kind":"scalar","type":"Boolean"},{"name":"isSpicy","kind":"scalar","type":"Boolean"},{"name":"isPopular","kind":"scalar","type":"Boolean"},{"name":"ingredients","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"mealCount","kind":"scalar","type":"Int","dbName":"meal_count"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"coverImage","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"reviewCount","kind":"scalar","type":"Int"},{"name":"deliveryTime","kind":"scalar","type":"String"},{"name":"deliveryFee","kind":"scalar","type":"Int"},{"name":"minOrder","kind":"scalar","type":"Int"},{"name":"cuisine","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"address","kind":"scalar","type":"String"},{"name":"restaurant","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
  }
});

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// src/router.ts
import { Router as Router9 } from "express";

// src/modules/auth/auth.routes.ts
import { Router } from "express";

// src/modules/auth/auth.service.ts
var providerCreate = async (payload) => {
  try {
    const userVerify = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });
    if (!userVerify) {
      throw new Error("User Not Found");
    }
    if (userVerify.role !== "PROVIDER") {
      throw new Error("User is not a provider");
    }
    const result = await prisma.providerProfile.create({
      data: {
        userId: userVerify.id
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
};
var authService = {
  providerCreate
};

// src/modules/auth/auth.controller.ts
var providerRegister = async (req, res) => {
  const data = req.body;
  const createProvider = await authService.providerCreate(data);
  res.status(200).json({
    success: true,
    message: "",
    data: createProvider
  });
};
var authController = {
  providerRegister
};

// src/modules/auth/auth.routes.ts
var router = Router();
router.post("/register", authController.providerRegister);
var authRouter = router;

// src/modules/category/category.routes.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var getAllCategory = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    });
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const mealCount = await prisma.meal.count({
          where: {
            categoryId: category.id,
            available: true
          }
        });
        return {
          ...category,
          mealCount
        };
      })
    );
    return categoriesWithCount;
  } catch (err) {
    console.error("Error in getAllCategories:", err);
    throw new Error("Error fetching categories");
  }
};
var categoryService = {
  getAllCategory
};

// src/modules/category/category.controller.ts
var getAllCategory2 = async (req, res) => {
  const result = await categoryService.getAllCategory();
  res.status(200).send({
    success: true,
    message: "Get All Category",
    data: result
  });
};
var categoryController = {
  getAllCategory: getAllCategory2
};

// src/modules/category/category.routes.ts
var router2 = Router2();
router2.get("/categorys", categoryController.getAllCategory);
var categoryRoute = router2;

// src/modules/order/order.routes.ts
import { Router as Router3 } from "express";

// src/modules/order/order.service.ts
var createNewOrder = async (data) => {
  try {
    if (!data) {
      throw new Error("Data not passed");
    }
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        providerId: data.providerId,
        totalPrice: data.totalPrice,
        deliveryAddress: data.deliveryAddress,
        status: OrderStatus.PLACED,
        // Setting default status to PLACED
        items: {
          create: data.items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
        // Include the related items in the response
      }
    });
    return order;
  } catch (err) {
    throw new Error(`${err}`);
  }
};
var getMyOrder = async (id) => {
  try {
    const result = await prisma.order.findMany({
      where: {
        customerId: id
      },
      include: {
        items: {
          include: {
            meal: true
          }
        },
        provider: true
      },
      orderBy: {
        createdAt: "desc"
      }
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
        price: item.price
      }))
    }));
    return formattedOrder;
  } catch (err) {
    throw new Error(`Failed to fetch orders: ${String(err)}`);
  }
};
var orderService = {
  createNewOrder,
  getMyOrder
};

// src/modules/order/order.controller.ts
var createNewOrder2 = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).send({
        success: false,
        message: "Invalid data format"
      });
    }
    const result = await orderService.createNewOrder(data);
    res.status(200).send({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "An error occurred while creating the order",
      error: err
    });
  }
};
var getOrderById = async (req, res) => {
  const { id } = req.params;
  console.log("test", id);
  const result = await orderService.getMyOrder(id);
  res.status(200).send({
    success: true,
    message: "",
    data: result
  });
};
var orderController = {
  createNewOrder: createNewOrder2,
  getOrderById
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      };
      console.log(session);
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources!"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/order/order.routes.ts
var router3 = Router3();
router3.get("/:id", auth_default("CUSTOMER" /* CUSTOMER */), orderController.getOrderById);
router3.post("/", auth_default("CUSTOMER" /* CUSTOMER */), orderController.createNewOrder);
var orderRouter = router3;

// src/modules/provider/provider.routes.ts
import { Router as Router4 } from "express";

// src/modules/provider/provider.service.ts
var getOrderByProviderId = async (providerId) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.customerId,
      userName: order.customer.name,
      userEmail: order.customer.email,
      userPhone: order.customer.phone || "N/A",
      userImage: order.customer.image,
      providerId: order.providerId,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map((item) => ({
        id: item.id,
        mealId: item.mealId,
        mealName: item.meal.name,
        quantity: item.quantity,
        price: item.price,
        image: item.meal.image
      })),
      subtotal: order.totalPrice,
      deliveryFee: 0,
      // Calculate if you have delivery fee logic
      total: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.createdAt.toISOString()
    }));
    return transformedOrders;
  } catch (error) {
    console.error("Error fetching provider orders:", error);
    throw new Error("Failed to fetch orders");
  }
};
var updateOrderStatus = async (orderId, status) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            meal: true
          }
        }
      }
    });
    return {
      id: order.id,
      status: order.status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};
var cancelOrder = async (orderId) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: OrderStatus.CANCELLED
      }
    });
    return {
      id: order.id,
      status: order.status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error("Failed to cancel order");
  }
};
var getMealsByProviderId = async (providerId) => {
  try {
    const meals = await prisma.meal.findMany({
      where: {
        providerId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        provider: {
          select: {
            id: true,
            restaurant: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformedMeals = meals.map((meal) => {
      const avgRating = meal.reviews.length > 0 ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) / meal.reviews.length : 0;
      return {
        id: meal.id,
        name: meal.name,
        slug: meal.slug,
        description: meal.description || "",
        image: meal.image || "",
        price: meal.price,
        originalPrice: Number(meal.originalPrice),
        category: meal.category.name,
        categoryId: meal.categoryId,
        providerId: meal.providerId,
        providerName: meal.provider.restaurant || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        reviewCount: meal.reviews.length,
        calories: meal.calories || 0,
        prepTime: meal.prepTime || "15-20 min",
        isVegetarian: meal.isVegetarian,
        isSpicy: meal.isSpicy,
        isPopular: meal.isPopular,
        available: meal.available,
        ingredients: meal.ingredients,
        createdAt: meal.createdAt.toISOString()
      };
    });
    return transformedMeals;
  } catch (error) {
    console.error("Error fetching provider meals:", error);
    throw new Error("Failed to fetch meals");
  }
};
var createMeal = async (mealData) => {
  try {
    const slug = mealData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const meal = await prisma.meal.create({
      data: {
        name: mealData.name,
        slug,
        description: mealData.description ?? null,
        price: mealData.price,
        originalPrice: mealData.originalPrice || 0,
        image: mealData.image ?? null,
        categoryId: mealData.categoryId,
        providerId: mealData.providerId,
        calories: mealData.calories ?? null,
        prepTime: mealData.prepTime ?? null,
        isVegetarian: mealData.isVegetarian || false,
        isSpicy: mealData.isSpicy || false,
        isPopular: mealData.isPopular || false,
        ingredients: mealData.ingredients || [],
        available: true
      },
      include: {
        category: true,
        provider: {
          select: {
            restaurant: true
          }
        }
      }
    });
    const mealWithRelations = meal;
    return {
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description || "",
      image: meal.image || "",
      price: meal.price,
      originalPrice: Number(meal.originalPrice),
      category: mealWithRelations.category.name,
      categoryId: meal.categoryId,
      providerId: meal.providerId,
      providerName: mealWithRelations.provider.restaurant || "Unknown",
      rating: 0,
      reviewCount: 0,
      calories: meal.calories || 0,
      prepTime: meal.prepTime || "15-20 min",
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
      available: meal.available,
      ingredients: meal.ingredients,
      createdAt: meal.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error creating meal:", error);
    throw new Error("Failed to create meal");
  }
};
var updateMeal = async (mealId, mealData) => {
  try {
    const updateData = { ...mealData };
    if (mealData.name) {
      updateData.slug = mealData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const meal = await prisma.meal.update({
      where: {
        id: mealId
      },
      data: updateData,
      include: {
        category: true,
        provider: {
          select: {
            restaurant: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });
    const avgRating = meal.reviews.length > 0 ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) / meal.reviews.length : 0;
    return {
      id: meal.id,
      name: meal.name,
      slug: meal.slug,
      description: meal.description || "",
      image: meal.image || "",
      price: meal.price,
      originalPrice: Number(meal.originalPrice),
      category: meal.category.name,
      categoryId: meal.categoryId,
      providerId: meal.providerId,
      providerName: meal.provider.restaurant || "Unknown",
      rating: Number(avgRating.toFixed(1)),
      reviewCount: meal.reviews.length,
      calories: meal.calories || 0,
      prepTime: meal.prepTime || "15-20 min",
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
      available: meal.available,
      ingredients: meal.ingredients,
      createdAt: meal.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error updating meal:", error);
    throw new Error("Failed to update meal");
  }
};
var deleteMeal = async (mealId) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        mealId
      }
    });
    if (orderItems.length > 0) {
      await prisma.meal.update({
        where: {
          id: mealId
        },
        data: {
          available: false
        }
      });
      return {
        id: mealId,
        message: "Meal marked as unavailable (has existing orders)"
      };
    } else {
      await prisma.meal.delete({
        where: {
          id: mealId
        }
      });
      return {
        id: mealId,
        message: "Meal deleted successfully"
      };
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw new Error("Failed to delete meal");
  }
};
var getProviderStats = async (providerId) => {
  try {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: {
        id: providerId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true
          }
        },
        meals: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
    if (!providerProfile) {
      throw new Error("Provider not found");
    }
    const transformedMeals = providerProfile.meals.map((meal) => {
      const avgRating = meal.reviews.length > 0 ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) / meal.reviews.length : 0;
      return {
        id: meal.id,
        name: meal.name,
        slug: meal.slug,
        description: meal.description || "",
        image: meal.image || "",
        price: meal.price,
        originalPrice: Number(meal.originalPrice),
        category: meal.category.name,
        categoryId: meal.categoryId,
        providerId: meal.providerId,
        providerName: providerProfile.restaurant || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        reviewCount: meal.reviews.length,
        calories: meal.calories || 0,
        prepTime: meal.prepTime || "15-20 min",
        isVegetarian: meal.isVegetarian,
        isSpicy: meal.isSpicy,
        isPopular: meal.isPopular,
        available: meal.available,
        ingredients: meal.ingredients,
        createdAt: meal.createdAt.toISOString()
      };
    });
    return transformedMeals;
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    throw new Error("Failed to fetch provider statistics");
  }
};
var getProviderDashboard = async (providerId) => {
  try {
    const [
      // Order stats
      totalOrders,
      placedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      // Meal stats
      totalMeals,
      availableMeals,
      popularMeals,
      // Revenue stats
      totalRevenue,
      monthlyRevenue,
      // Recent orders
      recentOrders
    ] = await Promise.all([
      // Order counts
      prisma.order.count({ where: { providerId } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.PLACED } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.PREPARING } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.READY } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { providerId, status: OrderStatus.CANCELLED } }),
      // Meal counts
      prisma.meal.count({ where: { providerId } }),
      prisma.meal.count({ where: { providerId, available: true } }),
      prisma.meal.count({ where: { providerId, isPopular: true } }),
      // Revenue calculations
      prisma.order.aggregate({
        where: {
          providerId,
          status: OrderStatus.DELIVERED
        },
        _sum: { totalPrice: true }
      }),
      prisma.order.aggregate({
        where: {
          providerId,
          status: OrderStatus.DELIVERED,
          createdAt: {
            gte: new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1)
          }
        },
        _sum: { totalPrice: true }
      }),
      // Recent orders (last 10)
      prisma.order.findMany({
        where: { providerId },
        include: {
          customer: {
            select: {
              name: true,
              phone: true
            }
          },
          items: {
            select: {
              quantity: true,
              meal: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 10
      })
    ]);
    return {
      orders: {
        total: totalOrders,
        placed: placedOrders,
        preparing: preparingOrders,
        ready: readyOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      meals: {
        total: totalMeals,
        available: availableMeals,
        popular: popularMeals
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0,
        monthly: monthlyRevenue._sum.totalPrice || 0
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customer.name,
        customerPhone: order.customer.phone || "N/A",
        status: order.status,
        total: order.totalPrice,
        itemCount: order.items.length,
        createdAt: order.createdAt.toISOString()
      }))
    };
  } catch (error) {
    console.error("Error fetching provider dashboard:", error);
    throw new Error("Failed to fetch provider dashboard");
  }
};
var getProviderProfile = async (providerId) => {
  try {
    const provider = await prisma.providerProfile.findUnique({
      where: {
        userId: providerId
      }
    });
    console.log(provider);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    throw new Error("Failed to fetch provider profile");
  }
};
var updateProviderProfile = async (providerId, profileData) => {
  try {
    const provider = await prisma.providerProfile.update({
      where: {
        id: providerId
      },
      data: profileData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return {
      id: provider.id,
      restaurant: provider.restaurant,
      description: provider.description,
      address: provider.address,
      phone: provider.phone,
      user: provider.user
    };
  } catch (error) {
    console.error("Error updating provider profile:", error);
    throw new Error("Failed to update provider profile");
  }
};
var getRevenueAnalytics = async (providerId, startDate, endDate) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId,
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        totalPrice: true,
        createdAt: true
      }
    });
    const revenueByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split("T")[0] ?? "";
      if (date) {
        const current = acc[date] ?? 0;
        acc[date] = current + order.totalPrice;
      }
      return acc;
    }, {});
    return {
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      orderCount: orders.length,
      revenueByDate
    };
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    throw new Error("Failed to fetch revenue analytics");
  }
};
var getTopSellingMeals = async (providerId, limit = 10) => {
  try {
    const topMeals = await prisma.orderItem.groupBy({
      by: ["mealId"],
      where: {
        meal: {
          providerId
        }
      },
      _sum: {
        quantity: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      },
      take: limit
    });
    const mealIds = topMeals.map((item) => item.mealId);
    const meals = await prisma.meal.findMany({
      where: {
        id: {
          in: mealIds
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true
      }
    });
    const topSellingMeals = topMeals.map((item) => {
      const meal = meals.find((m) => m.id === item.mealId);
      return {
        mealId: item.mealId,
        name: meal?.name || "Unknown",
        image: meal?.image,
        price: meal?.price || 0,
        totalQuantity: item._sum.quantity || 0,
        orderCount: item._count.id,
        revenue: (item._sum.quantity || 0) * (meal?.price || 0)
      };
    });
    return topSellingMeals;
  } catch (error) {
    console.error("Error fetching top selling meals:", error);
    throw new Error("Failed to fetch top selling meals");
  }
};
var providerService = {
  getMealsByProviderId,
  getProviderStats,
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
  getRevenueAnalytics,
  getTopSellingMeals,
  getOrderByProviderId,
  updateOrderStatus,
  cancelOrder,
  createMeal,
  updateMeal,
  deleteMeal
};

// src/modules/provider/provider.controller.ts
var getProviderStats2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const meals = await providerService.getProviderStats(
      providerId
    );
    res.status(200).json({
      success: true,
      message: "Provider meals retrieved successfully",
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getOrderByProviderId2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const orders = await providerService.getOrderByProviderId(
      providerId
    );
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getProviderDashboard2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const dashboard = await providerService.getProviderDashboard(
      providerId
    );
    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getProviderProfile2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const profile = await providerService.getProviderProfile(
      providerId
    );
    res.status(200).json({
      success: true,
      message: "Provider profile retrieved successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var updateProviderProfile2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const profileData = req.body;
    const profile = await providerService.updateProviderProfile(
      providerId,
      profileData
    );
    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getRevenueAnalytics2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required"
      });
    }
    const analytics = await providerService.getRevenueAnalytics(
      providerId,
      new Date(startDate),
      new Date(endDate)
    );
    res.status(200).json({
      success: true,
      message: "Revenue analytics retrieved successfully",
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getTopSellingMeals2 = async (req, res) => {
  try {
    const providerId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const topMeals = await providerService.getTopSellingMeals(
      providerId,
      limit
    );
    res.status(200).json({
      success: true,
      message: "Top selling meals retrieved successfully",
      data: topMeals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const order = await providerService.updateOrderStatus(
      orderId,
      status
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var cancelOrder2 = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await providerService.cancelOrder(orderId);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var createMeal2 = async (req, res) => {
  try {
    const mealData = req.body;
    if (!mealData.name || !mealData.price || !mealData.categoryId || !mealData.providerId) {
      return res.status(400).json({
        success: false,
        message: "Name, price, categoryId, and providerId are required"
      });
    }
    const meal = await providerService.createMeal(mealData);
    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: meal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var updateMeal2 = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const mealData = req.body;
    const meal = await providerService.updateMeal(
      mealId,
      mealData
    );
    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: meal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var deleteMeal2 = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const result = await providerService.deleteMeal(mealId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var providerController = {
  // Stats & Dashboard
  getProviderStats: getProviderStats2,
  getProviderDashboard: getProviderDashboard2,
  getProviderProfile: getProviderProfile2,
  updateProviderProfile: updateProviderProfile2,
  getRevenueAnalytics: getRevenueAnalytics2,
  getTopSellingMeals: getTopSellingMeals2,
  // Orders
  getOrderByProviderId: getOrderByProviderId2,
  updateOrderStatus: updateOrderStatus2,
  cancelOrder: cancelOrder2,
  // Meals
  createMeal: createMeal2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/modules/provider/provider.routes.ts
var router4 = Router4();
router4.get("/stats/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderStats);
router4.get("/dashboard/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.getProviderDashboard);
router4.get("/profile/:id", providerController.getProviderProfile);
router4.put("/profile/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.updateProviderProfile);
router4.get("/analytics/:id/revenue", auth_default("PROVIDER" /* PROVIDER */), providerController.getRevenueAnalytics);
router4.get("/analytics/:id/top-meals", auth_default("PROVIDER" /* PROVIDER */), providerController.getTopSellingMeals);
router4.get("/orders/:id", auth_default("PROVIDER" /* PROVIDER */), providerController.getOrderByProviderId);
router4.put("/orders/:orderId/status", auth_default("PROVIDER" /* PROVIDER */), providerController.updateOrderStatus);
router4.put("/orders/:orderId/cancel", auth_default("PROVIDER" /* PROVIDER */), providerController.cancelOrder);
router4.post("/meals", auth_default("PROVIDER" /* PROVIDER */), providerController.createMeal);
router4.put("/meals/:mealId", auth_default("PROVIDER" /* PROVIDER */), providerController.updateMeal);
router4.delete("/meals/:mealId", auth_default("PROVIDER" /* PROVIDER */), providerController.deleteMeal);
var providerRouter = router4;

// src/modules/admin/admin.routes.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.Service.ts
var getDashboardStats = async () => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProviders,
      totalMeals,
      totalCategories,
      pendingOrders,
      deliveredOrders,
      recentOrders
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      // Total revenue (delivered orders only)
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { totalPrice: true }
      }),
      // Total customers
      prisma.user.count({
        where: { role: "USER" }
      }),
      // Total providers
      prisma.providerProfile.count(),
      // Total meals
      prisma.meal.count(),
      // Total categories
      prisma.category.count(),
      // Pending orders (PLACED + PREPARING)
      prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.PLACED, OrderStatus.PREPARING]
          }
        }
      }),
      // Delivered orders
      prisma.order.count({
        where: { status: OrderStatus.DELIVERED }
      }),
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              name: true,
              email: true
            }
          },
          provider: {
            select: {
              restaurant: true
            }
          }
        }
      })
    ]);
    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalCustomers,
      totalProviders,
      totalMeals,
      totalCategories,
      pendingOrders,
      deliveredOrders,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customer.name,
        providerName: order.provider.restaurant || "Unknown",
        total: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt.toISOString()
      }))
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
};
var getAllUsers = async (role) => {
  try {
    const where = {};
    if (role && role !== "all") {
      where.role = role.toUpperCase();
    }
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalPrice: true
          }
        },
        providerProfile: {
          select: {
            restaurant: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
      role: user.role?.toLowerCase() || "customer",
      status: user.status?.toLowerCase() || "active",
      phone: user.phone,
      createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      ordersCount: user.orders.length,
      totalSpent: user.orders.reduce((sum, order) => sum + order.totalPrice, 0),
      restaurantName: user.providerProfile?.restaurant
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};
var updateUserStatus = async (userId, status) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: status.toUpperCase() },
      select: {
        id: true,
        status: true
      }
    });
    return {
      id: user.id,
      status: user.status?.toLowerCase() || "active"
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
};
var getAllOrders = async (status) => {
  try {
    const where = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }
    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        provider: {
          select: {
            id: true,
            restaurant: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return orders.map((order) => ({
      id: order.id,
      userId: order.customerId,
      userName: order.customer.name,
      userEmail: order.customer.email,
      userPhone: order.customer.phone || "N/A",
      providerId: order.providerId,
      providerName: order.provider.restaurant || "Unknown",
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map((item) => ({
        id: item.id,
        mealId: item.mealId,
        mealName: item.meal.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.totalPrice,
      deliveryFee: 0,
      total: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};
var getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            meals: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      image: category.image,
      mealCount: category._count.meals,
      createdAt: category.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
var createCategory = async (categoryData) => {
  try {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await prisma.category.create({
      data: {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        slug,
        icon: categoryData.icon || "\u{1F37D}\uFE0F",
        image: categoryData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        mealCount: 0
      }
    });
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      image: category.image,
      mealCount: 0,
      createdAt: category.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};
var updateCategory = async (categoryId, categoryData) => {
  try {
    const updateData = { ...categoryData };
    if (categoryData.name) {
      updateData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        _count: {
          select: {
            meals: true
          }
        }
      }
    });
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      image: category.image,
      mealCount: category._count.meals,
      createdAt: category.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};
var deleteCategory = async (categoryId) => {
  try {
    const mealsCount = await prisma.meal.count({
      where: { categoryId }
    });
    if (mealsCount > 0) {
      throw new Error("Cannot delete category with existing meals");
    }
    await prisma.category.delete({
      where: { id: categoryId }
    });
    return {
      id: categoryId,
      message: "Category deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
var getAllMeals = async () => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        provider: {
          select: {
            restaurant: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return meals.map((meal) => {
      const avgRating = meal.reviews.length > 0 ? meal.reviews.reduce((sum, review) => sum + review.rating, 0) / meal.reviews.length : 0;
      return {
        id: meal.id,
        name: meal.name,
        slug: meal.slug,
        description: meal.description || "",
        image: meal.image || "",
        price: meal.price,
        originalPrice: Number(meal.originalPrice),
        category: meal.category.name,
        categoryId: meal.categoryId,
        providerId: meal.providerId,
        providerName: meal.provider.restaurant || "Unknown",
        rating: Number(avgRating.toFixed(1)),
        reviewCount: meal.reviews.length,
        calories: meal.calories || 0,
        prepTime: meal.prepTime || "15-20 min",
        isVegetarian: meal.isVegetarian,
        isSpicy: meal.isSpicy,
        isPopular: meal.isPopular,
        available: meal.available,
        ingredients: meal.ingredients,
        createdAt: meal.createdAt.toISOString()
      };
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals");
  }
};
var adminService = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllOrders,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllMeals
};

// src/modules/admin/admin.Controller.ts
var getDashboardStats2 = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getAllUsers2 = async (req, res) => {
  try {
    const role = req.query.role;
    const users = await adminService.getAllUsers(role);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const { status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID and status are required"
      });
    }
    const user = await adminService.updateUserStatus(userId, status);
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const status = req.query.status;
    const orders = await adminService.getAllOrders(status);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const categories = await adminService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var createCategory2 = async (req, res) => {
  try {
    const categoryData = req.body;
    if (!categoryData.name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }
    const category = await adminService.createCategory(categoryData);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const categoryId = Array.isArray(req.params.categoryId) ? req.params.categoryId[0] : req.params.categoryId;
    const categoryData = req.body;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }
    const category = await adminService.updateCategory(categoryId, categoryData);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const categoryId = Array.isArray(req.params.categoryId) ? req.params.categoryId[0] : req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }
    const result = await adminService.deleteCategory(categoryId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
      error
    });
  }
};
var getAllMeals2 = async (req, res) => {
  try {
    const meals = await adminService.getAllMeals();
    res.status(200).json({
      success: true,
      message: "Meals retrieved successfully",
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};
var adminController = {
  getDashboardStats: getDashboardStats2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getAllOrders: getAllOrders2,
  getAllCategories: getAllCategories2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getAllMeals: getAllMeals2
};

// src/modules/admin/admin.routes.ts
var router5 = Router5();
router5.get("/dashboard", auth_default("ADMIN" /* ADMIN */), adminController.getDashboardStats);
router5.get("/users", auth_default("ADMIN" /* ADMIN */), adminController.getAllUsers);
router5.put("/users/:userId/status", auth_default("ADMIN" /* ADMIN */), adminController.updateUserStatus);
router5.get("/orders", auth_default("ADMIN" /* ADMIN */), adminController.getAllOrders);
router5.get("/categories", auth_default("ADMIN" /* ADMIN */), adminController.getAllCategories);
router5.post("/categories", auth_default("ADMIN" /* ADMIN */), adminController.createCategory);
router5.put("/categories/:categoryId", auth_default("ADMIN" /* ADMIN */), adminController.updateCategory);
router5.delete("/categories/:categoryId", auth_default("ADMIN" /* ADMIN */), adminController.deleteCategory);
router5.get("/meals", auth_default("ADMIN" /* ADMIN */), adminController.getAllMeals);
var adminRouter = router5;

// src/modules/restaurant/restaurant.routes.ts
import { Router as Router6 } from "express";

// src/modules/restaurant/restaurant.service.ts
var getAllRestaurant = async () => {
  try {
    const result = await prisma.providerProfile.findMany({
      include: {
        _count: {
          select: {
            meals: true,
            orders: true
          }
        }
      },
      orderBy: {
        rating: "desc"
      }
    });
    return result;
  } catch (err) {
    throw err;
  }
};
var getRestaurantById = async (providerId) => {
  console.log(providerId, "provider id");
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const result = await prisma.providerProfile.findUnique({
      where: {
        id: providerId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            meals: true,
            orders: true
          }
        }
      }
    });
    return result;
  } catch (err) {
    throw new Error("Fetch error while getting provider details");
  }
};
var getRestaurantMeals = async (providerId) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const meals = await prisma.meal.findMany({
      where: {
        providerId,
        available: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return meals;
  } catch (err) {
    throw new Error("Error fetching restaurant meals");
  }
};
var getRestaurantReviews = async (providerId) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const meals = await prisma.meal.findMany({
      where: {
        providerId
      },
      select: {
        id: true
      }
    });
    const mealIds = meals.map((meal) => meal.id);
    const reviews = await prisma.review.findMany({
      where: {
        mealId: {
          in: mealIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        meal: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
      // Limit to recent 20 reviews
    });
    return reviews;
  } catch (err) {
    throw new Error("Error fetching restaurant reviews");
  }
};
var updateRestaurant = async (providerId, data) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const updatedRestaurant = await prisma.providerProfile.update({
      where: {
        id: providerId
      },
      data
    });
    return updatedRestaurant;
  } catch (err) {
    throw new Error("Error updating restaurant profile");
  }
};
var getRestaurantStats = async (providerId) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const totalOrders = await prisma.order.count({
      where: {
        providerId
      }
    });
    const orders = await prisma.order.findMany({
      where: {
        providerId,
        status: "DELIVERED"
      },
      select: {
        totalPrice: true
      }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalMeals = await prisma.meal.count({
      where: {
        providerId
      }
    });
    const restaurant = await prisma.providerProfile.findUnique({
      where: {
        id: providerId
      },
      select: {
        rating: true,
        reviewCount: true
      }
    });
    return {
      totalOrders,
      totalRevenue,
      totalMeals,
      rating: restaurant?.rating || 0,
      reviewCount: restaurant?.reviewCount || 0
    };
  } catch (err) {
    throw new Error("Error fetching restaurant statistics");
  }
};
var restaurantService = {
  getAllRestaurant,
  getRestaurantById,
  getRestaurantMeals,
  getRestaurantReviews,
  updateRestaurant,
  getRestaurantStats
};

// src/modules/restaurant/restaurant.controller.ts
var getAllRestaurant2 = async (req, res) => {
  try {
    const result = await restaurantService.getAllRestaurant();
    if (result) {
      res.status(200).send({
        success: true,
        message: "Restaurants fetched successfully",
        data: result
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurants",
      error: err.message || err
    });
  }
};
var getRestaurantById2 = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null
    });
  }
  try {
    const result = await restaurantService.getRestaurantById(id);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
        data: null
      });
    }
    res.status(200).send({
      success: true,
      message: "Restaurant fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant details",
      error: error.message || error
    });
  }
};
var getRestaurantMeals2 = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null
    });
  }
  try {
    const meals = await restaurantService.getRestaurantMeals(id);
    res.status(200).send({
      success: true,
      message: "Meals fetched successfully",
      data: meals
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant meals",
      error: error.message || error
    });
  }
};
var getRestaurantReviews2 = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Restaurant ID is required",
      data: null
    });
  }
  try {
    const reviews = await restaurantService.getRestaurantReviews(id);
    res.status(200).send({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch restaurant reviews",
      error: error.message || error
    });
  }
};
var restaurantController = {
  getAllRestaurant: getAllRestaurant2,
  getRestaurantById: getRestaurantById2,
  getRestaurantMeals: getRestaurantMeals2,
  getRestaurantReviews: getRestaurantReviews2
};

// src/modules/restaurant/restaurant.routes.ts
var router6 = Router6();
router6.get("/", restaurantController.getAllRestaurant);
router6.get("/:id", restaurantController.getRestaurantById);
router6.get("/:id/meals", restaurantController.getRestaurantMeals);
router6.get("/:id/reviews", restaurantController.getRestaurantReviews);
var restaurantRouter = router6;

// src/modules/meal/meal.routes.ts
import { Router as Router7 } from "express";

// src/modules/meal/meal.service.ts
var getAllMealsWithPagination = async (filters) => {
  try {
    const {
      search,
      categoryId,
      isVegetarian,
      isSpicy,
      isPopular,
      minPrice,
      maxPrice,
      sort = "popular",
      page = 1,
      limit = 12
    } = filters;
    const where = {
      available: true
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { ingredients: { hasSome: [search] } }
      ];
    }
    if (categoryId) {
      if (Array.isArray(categoryId)) {
        where.categoryId = { in: categoryId };
      } else {
        where.categoryId = categoryId;
      }
    }
    if (isVegetarian !== void 0) {
      where.isVegetarian = isVegetarian;
    }
    if (isSpicy !== void 0) {
      where.isSpicy = isSpicy;
    }
    if (isPopular !== void 0) {
      where.isPopular = isPopular;
    }
    if (minPrice !== void 0 || maxPrice !== void 0) {
      where.price = {};
      if (minPrice !== void 0) where.price.gte = minPrice;
      if (maxPrice !== void 0) where.price.lte = maxPrice;
    }
    let orderBy = {};
    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { createdAt: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
      default:
        orderBy = { isPopular: "desc" };
        break;
    }
    const skip = (page - 1) * limit;
    const total = await prisma.meal.count({ where });
    const meals = await prisma.meal.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    });
    const mealsWithRatings = await Promise.all(
      meals.map(async (meal) => {
        const reviews = await prisma.review.findMany({
          where: { mealId: meal.id },
          select: { rating: true }
        });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return {
          ...meal,
          rating: avgRating,
          reviewCount: reviews.length
        };
      })
    );
    return {
      meals: mealsWithRatings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (err) {
    console.error("Error in getAllMealsWithPagination:", err);
    throw new Error("Error fetching meals");
  }
};
var getAllMeals3 = async (filters) => {
  try {
    const where = {
      available: true
    };
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters?.providerId) {
      where.providerId = filters.providerId;
    }
    if (filters?.isVegetarian !== void 0) {
      where.isVegetarian = filters.isVegetarian;
    }
    if (filters?.isSpicy !== void 0) {
      where.isSpicy = filters.isSpicy;
    }
    if (filters?.isPopular !== void 0) {
      where.isPopular = filters.isPopular;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } }
      ];
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    const meals = await prisma.meal.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            address: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return meals;
  } catch (err) {
    throw new Error("Error fetching meals");
  }
};
var getMealById = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }
  try {
    const meal = await prisma.meal.findUnique({
      where: {
        id: mealId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            image: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            rating: true,
            reviewCount: true,
            address: true,
            deliveryTime: true,
            deliveryFee: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      }
    });
    if (!meal) return null;
    const reviews = await prisma.review.findMany({
      where: { mealId: meal.id },
      select: { rating: true }
    });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return {
      ...meal,
      rating: avgRating,
      reviewCount: reviews.length
    };
  } catch (err) {
    throw new Error("Error fetching meal details");
  }
};
var getMealReviews = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }
  try {
    const reviews = await prisma.review.findMany({
      where: {
        mealId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return reviews;
  } catch (err) {
    throw new Error("Error fetching meal reviews");
  }
};
var getRelatedMeals = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }
  try {
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      select: { providerId: true }
    });
    if (!meal) {
      throw new Error("Meal not found");
    }
    const relatedMeals = await prisma.meal.findMany({
      where: {
        providerId: meal.providerId,
        available: true,
        id: {
          not: mealId
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      take: 4,
      orderBy: {
        createdAt: "desc"
      }
    });
    return relatedMeals;
  } catch (err) {
    throw new Error("Error fetching related meals");
  }
};
var createMeal3 = async (data) => {
  try {
    const newMeal = await prisma.meal.create({
      data: {
        ...data,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : 0
      },
      include: {
        category: true,
        provider: true
      }
    });
    return newMeal;
  } catch (err) {
    throw new Error("Error creating meal");
  }
};
var updateMeal3 = async (mealId, data) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }
  try {
    const updatedMeal = await prisma.meal.update({
      where: {
        id: mealId
      },
      data,
      include: {
        category: true,
        provider: true
      }
    });
    return updatedMeal;
  } catch (err) {
    throw new Error("Error updating meal");
  }
};
var deleteMeal3 = async (mealId) => {
  if (!mealId) {
    throw new Error("Meal ID is missing");
  }
  try {
    const deletedMeal = await prisma.meal.update({
      where: {
        id: mealId
      },
      data: {
        available: false
      }
    });
    return deletedMeal;
  } catch (err) {
    throw new Error("Error deleting meal");
  }
};
var addMealReview = async (data) => {
  try {
    const review = await prisma.review.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    return review;
  } catch (err) {
    throw new Error("Error adding review");
  }
};
var mealService = {
  getAllMeals: getAllMeals3,
  getAllMealsWithPagination,
  getMealById,
  getMealReviews,
  getRelatedMeals,
  createMeal: createMeal3,
  updateMeal: updateMeal3,
  deleteMeal: deleteMeal3,
  addMealReview
};

// src/modules/meal/meal.controller.ts
var getAllMeals4 = async (req, res) => {
  try {
    const search = req.query.search;
    const sort = req.query.sort;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    let categoryId;
    if (req.query.categoryId) {
      categoryId = Array.isArray(req.query.categoryId) ? req.query.categoryId : [req.query.categoryId];
    }
    const isVegetarian = req.query.isVegetarian === "true" ? true : void 0;
    const isSpicy = req.query.isSpicy === "true" ? true : void 0;
    const isPopular = req.query.isPopular === "true" ? true : void 0;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : void 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : void 0;
    const filters = {
      search,
      categoryId,
      isVegetarian,
      isSpicy,
      isPopular,
      minPrice,
      maxPrice,
      sort,
      page,
      limit
    };
    const result = await mealService.getAllMealsWithPagination(filters);
    res.status(200).send({
      success: true,
      message: "Meals fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch meals",
      error: error.message || error
    });
  }
};
var getMealById2 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null
    });
  }
  try {
    const meal = await mealService.getMealById(id);
    if (!meal) {
      return res.status(404).send({
        success: false,
        message: "Meal not found",
        data: null
      });
    }
    res.status(200).send({
      success: true,
      message: "Meal fetched successfully",
      data: meal
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch meal details",
      error: error.message || error
    });
  }
};
var getMealReviews2 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null
    });
  }
  try {
    const reviews = await mealService.getMealReviews(id);
    res.status(200).send({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message || error
    });
  }
};
var getRelatedMeals2 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null
    });
  }
  try {
    const relatedMeals = await mealService.getRelatedMeals(id);
    res.status(200).send({
      success: true,
      message: "Related meals fetched successfully",
      data: relatedMeals
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch related meals",
      error: error.message || error
    });
  }
};
var createMeal4 = async (req, res) => {
  const mealData = req.body;
  if (!mealData.name || !mealData.price || !mealData.providerId || !mealData.categoryId) {
    return res.status(400).send({
      success: false,
      message: "Name, price, provider ID, and category ID are required",
      data: null
    });
  }
  try {
    const newMeal = await mealService.createMeal(mealData);
    res.status(201).send({
      success: true,
      message: "Meal created successfully",
      data: newMeal
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to create meal",
      error: error.message || error
    });
  }
};
var updateMeal4 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updateData = req.body;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null
    });
  }
  try {
    const updatedMeal = await mealService.updateMeal(id, updateData);
    res.status(200).send({
      success: true,
      message: "Meal updated successfully",
      data: updatedMeal
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update meal",
      error: error.message || error
    });
  }
};
var deleteMeal4 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Meal ID is required",
      data: null
    });
  }
  try {
    await mealService.deleteMeal(id);
    res.status(200).send({
      success: true,
      message: "Meal deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete meal",
      error: error.message || error
    });
  }
};
var addMealReview2 = async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { userId, rating, comment } = req.body;
  if (!id || !userId || !rating) {
    return res.status(400).send({
      success: false,
      message: "Meal ID, user ID, and rating are required",
      data: null
    });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).send({
      success: false,
      message: "Rating must be between 1 and 5",
      data: null
    });
  }
  try {
    const review = await mealService.addMealReview({
      mealId: id,
      userId,
      rating,
      comment
    });
    res.status(201).send({
      success: true,
      message: "Review added successfully",
      data: review
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to add review",
      error: error.message || error
    });
  }
};
var mealController = {
  getAllMeals: getAllMeals4,
  getMealById: getMealById2,
  getMealReviews: getMealReviews2,
  getRelatedMeals: getRelatedMeals2,
  createMeal: createMeal4,
  updateMeal: updateMeal4,
  deleteMeal: deleteMeal4,
  addMealReview: addMealReview2
};

// src/modules/meal/meal.routes.ts
var router7 = Router7();
router7.get("/", mealController.getAllMeals);
router7.get("/:id", mealController.getMealById);
router7.get("/:id/reviews", mealController.getMealReviews);
router7.get("/:id/related", mealController.getRelatedMeals);
router7.post("/", mealController.createMeal);
router7.patch("/:id", mealController.updateMeal);
router7.delete("/:id", mealController.deleteMeal);
router7.post("/:id/reviews", mealController.addMealReview);
var mealRouter = router7;

// src/modules/review/review.routes.ts
import { Router as Router8 } from "express";

// src/modules/review/review.service.ts
var getCustomerOrders = async (customerId) => {
  if (!customerId) {
    throw new Error("Customer ID is missing");
  }
  try {
    const orders = await prisma.order.findMany({
      where: {
        customerId
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                providerId: true
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const ordersWithFilteredReviews = await Promise.all(
      orders.map(async (order) => {
        const transformedItems = order.items.map((item) => ({
          id: item.id,
          name: item.meal.name,
          quantity: item.quantity,
          price: item.price,
          mealId: item.mealId,
          image: item.meal.image
        }));
        const mealIds = transformedItems.map((item) => item.mealId);
        const review = await prisma.review.findFirst({
          where: {
            userId: customerId,
            mealId: {
              in: mealIds
            },
            createdAt: {
              gte: order.createdAt
            }
          },
          orderBy: {
            createdAt: "desc"
          }
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
          review: review || null
          // ✅ IMPORTANT
        };
      })
    );
    return ordersWithFilteredReviews;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching customer orders");
  }
};
var getOrderById2 = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is missing");
  }
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true,
            address: true,
            phone: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                description: true
              }
            }
          }
        }
      }
    });
    return order;
  } catch (err) {
    throw new Error("Error fetching order details");
  }
};
var createOrder = async (data) => {
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
            price: item.price
          }))
        }
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });
    return order;
  } catch (err) {
    throw new Error("Error creating order");
  }
};
var updateOrderStatus3 = async (orderId, status) => {
  if (!orderId) {
    throw new Error("Order ID is missing");
  }
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return updatedOrder;
  } catch (err) {
    throw new Error("Error updating order status");
  }
};
var addOrderReview = async (data) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        items: {
          take: 1,
          select: {
            mealId: true
          }
        }
      }
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
    const review = await prisma.review.create({
      data: {
        userId: data.userId,
        mealId,
        rating: data.rating,
        comment: data.comment ?? null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    return review;
  } catch (err) {
    throw new Error(err.message || "Error adding review");
  }
};
var updateOrderReview = async (reviewId, data) => {
  if (!reviewId) {
    throw new Error("Review ID is missing");
  }
  try {
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId
      },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    return updatedReview;
  } catch (err) {
    throw new Error("Error updating review");
  }
};
var deleteOrderReview = async (reviewId) => {
  if (!reviewId) {
    throw new Error("Review ID is missing");
  }
  try {
    const deletedReview = await prisma.review.delete({
      where: {
        id: reviewId
      }
    });
    return deletedReview;
  } catch (err) {
    throw new Error("Error deleting review");
  }
};
var getProviderOrders = async (providerId) => {
  if (!providerId) {
    throw new Error("Provider ID is missing");
  }
  try {
    const orders = await prisma.order.findMany({
      where: {
        providerId
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return orders;
  } catch (err) {
    throw new Error("Error fetching provider orders");
  }
};
var reviewService = {
  getCustomerOrders,
  getOrderById: getOrderById2,
  createOrder,
  updateOrderStatus: updateOrderStatus3,
  addOrderReview,
  updateOrderReview,
  deleteOrderReview,
  getProviderOrders
};

// src/modules/review/review.controller.ts
var getCustomerOrders2 = async (req, res) => {
  const { customerId } = req.params;
  if (!customerId) {
    return res.status(400).send({
      success: false,
      message: "Customer ID is required",
      data: null
    });
  }
  try {
    const orders = await reviewService.getCustomerOrders(customerId);
    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error: error.message || error
    });
  }
};
var addOrderReview2 = async (req, res) => {
  const orderId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const { userId, rating, comment } = req.body;
  if (!orderId || !userId || !rating) {
    return res.status(400).send({
      success: false,
      message: "Order ID, user ID, and rating are required",
      data: null
    });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).send({
      success: false,
      message: "Rating must be between 1 and 5",
      data: null
    });
  }
  try {
    const review = await reviewService.addOrderReview({
      orderId,
      userId,
      rating,
      comment
    });
    res.status(201).send({
      success: true,
      message: "Review added successfully",
      data: review
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Failed to add review",
      error: error.message || error
    });
  }
};
var updateOrderReview2 = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  if (!reviewId) {
    return res.status(400).send({
      success: false,
      message: "Review ID is required",
      data: null
    });
  }
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).send({
      success: false,
      message: "Rating must be between 1 and 5",
      data: null
    });
  }
  try {
    const updatedReview = await reviewService.updateOrderReview(reviewId, {
      rating,
      comment
    });
    res.status(200).send({
      success: true,
      message: "Review updated successfully",
      data: updatedReview
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update review",
      error: error.message || error
    });
  }
};
var deleteOrderReview2 = async (req, res) => {
  const { reviewId } = req.params;
  if (!reviewId) {
    return res.status(400).send({
      success: false,
      message: "Review ID is required",
      data: null
    });
  }
  try {
    await reviewService.deleteOrderReview(reviewId);
    res.status(200).send({
      success: true,
      message: "Review deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to delete review",
      error: error.message || error
    });
  }
};
var reviewController = {
  getCustomerOrders: getCustomerOrders2,
  addOrderReview: addOrderReview2,
  updateOrderReview: updateOrderReview2,
  deleteOrderReview: deleteOrderReview2
};

// src/modules/review/review.routes.ts
var router8 = Router8();
router8.get("/:customerId", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.getCustomerOrders);
router8.post("/:orderId/review", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.addOrderReview);
router8.patch("/:orderId/review/:reviewId", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.updateOrderReview);
router8.delete("/:orderId/review/:reviewId", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.deleteOrderReview);
var reviewRouter = router8;

// src/router.ts
var router9 = Router9();
router9.use("/auth", authRouter);
router9.use("/cat", categoryRoute);
router9.use("/meals", mealRouter);
router9.use("/order", orderRouter);
router9.use("/provider", providerRouter);
router9.use("/admin", adminRouter);
router9.use("/restaurant", restaurantRouter);
router9.use("/review", reviewRouter);
var router_default = router9;

// src/app.ts
dotenv.config();
var app = express();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", router_default);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    message: "Welcome to the Meal Delivery Service API",
    endpoint: {
      "user login POST": "/api/auth/signin/email",
      "user register POST": "/api/auth/signup/email",
      "meals get all GET": "/api/meals",
      "meal get by id GET": "/api/meals/:id",
      "meal create POST": "/api/meals",
      "meal update PUT": "/api/meals/:id",
      "meal delete DELETE": "/api/meals/:id",
      "meal reviews GET": "/api/meals/:id/reviews",
      "meal related GET": "/api/meals/:id/related",
      "add meal review POST": "/api/meals/:id/reviews",
      "categories GET": "/api/cat",
      "orders GET": "/api/order",
      "providers GET": "/api/provider",
      "admin GET": "/api/admin",
      "restaurant GET": "/api/restaurant",
      "review GET": "/api/review"
    }
  });
});
var app_default = app;

// src/config/envConfig.ts
var envConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5e3,
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/myapp",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  SERVER_URL: process.env.BETTER_AUTH_URL || "http://localhost:8000"
};
var envConfig_default = envConfig;

// src/server.ts
app_default.listen(envConfig_default.PORT, () => {
  console.log(`
        Server is running on port ${envConfig_default.PORT}
        Environment: ${envConfig_default.NODE_ENV}
        Server URL: http://localhost:${envConfig_default.PORT}`);
});
