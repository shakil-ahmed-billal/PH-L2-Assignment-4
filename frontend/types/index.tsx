export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string; 
    status: string; 
    total: number;
    items: OrderItem[];
    provider: string;
    userName?: string;
}


export interface Restaurant {
    id: string;
    userId: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    coverImage: string;
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    cuisine: string[];
    isOpen: boolean;
    address: string;
    restaurant: string;
    phone: string;
    createdAt: string;
  }
  
export   interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    available: boolean;
    slug: string;
    calories: number;
    prepTime: string;
    isVegetarian: boolean;
    isSpicy: boolean;
    isPopular: boolean;
    ingredients: string[];
    providerId: string;
    categoryId: string;
  }
  
export  interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    mealId: string;
    createdAt: string;
    user: {
      name: string;
      image: string;
    };
  }


  export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
  }
  
  export interface SessionResponse {
    user: User | null; 
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      expiresAt: Date;
      userAgent?: string;
      ipAddress?: string;
    } | null;
  }