// FoodHub Mock Data

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  mealCount: number;
}

export interface Provider {
  id: string;
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
}

export interface Meal {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryId: string;
  providerId: string;
  providerName: string;
  rating: number;
  reviewCount: number;
  calories: number;
  prepTime: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  ingredients: string[];
}

export interface Review {
  id: string;
  mealId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: {
    mealId: string;
    mealName: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  deliveryAddress: string;
  paymentMethod: "cash";
  providerId: string;
  providerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "provider" | "admin";
  status: "active" | "suspended";
  avatar: string;
  createdAt: string;
  ordersCount?: number;
  totalSpent?: number;
  restaurantName?: string;
}

// Categories
export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Burgers",
    slug: "burgers",
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    mealCount: 24,
  },
  {
    id: "cat-2",
    name: "Pizza",
    slug: "pizza",
    icon: "🍕",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    mealCount: 18,
  },
  {
    id: "cat-3",
    name: "Sushi",
    slug: "sushi",
    icon: "🍣",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    mealCount: 32,
  },
  {
    id: "cat-4",
    name: "Pasta",
    slug: "pasta",
    icon: "🍝",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    mealCount: 15,
  },
  {
    id: "cat-5",
    name: "Salads",
    slug: "salads",
    icon: "🥗",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    mealCount: 20,
  },
  {
    id: "cat-6",
    name: "Desserts",
    slug: "desserts",
    icon: "🍰",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
    mealCount: 28,
  },
  {
    id: "cat-7",
    name: "Asian",
    slug: "asian",
    icon: "🥢",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
    mealCount: 35,
  },
  {
    id: "cat-8",
    name: "Mexican",
    slug: "mexican",
    icon: "🌮",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    mealCount: 22,
  },
];

// Providers (Restaurants)
export const providers: Provider[] = [
  {
    id: "prov-1",
    name: "Burger Palace",
    slug: "burger-palace",
    description: "Home of the juiciest burgers in town. Made with 100% premium beef and fresh ingredients.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 1250,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    minOrder: 15,
    cuisine: ["American", "Fast Food", "Burgers"],
    isOpen: true,
    address: "123 Main Street, Downtown",
  },
  {
    id: "prov-2",
    name: "Sakura Sushi",
    slug: "sakura-sushi",
    description: "Authentic Japanese cuisine with the freshest fish flown in daily from Tokyo's Tsukiji market.",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 890,
    deliveryTime: "30-40 min",
    deliveryFee: 3.99,
    minOrder: 25,
    cuisine: ["Japanese", "Sushi", "Asian"],
    isOpen: true,
    address: "456 Cherry Blossom Ave",
  },
  {
    id: "prov-3",
    name: "Pizza Napoli",
    slug: "pizza-napoli",
    description: "Traditional Neapolitan pizza made in wood-fired ovens with San Marzano tomatoes and fresh mozzarella.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 2100,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    minOrder: 12,
    cuisine: ["Italian", "Pizza"],
    isOpen: true,
    address: "789 Little Italy Blvd",
  },
  {
    id: "prov-4",
    name: "Green Bowl",
    slug: "green-bowl",
    description: "Fresh, healthy bowls and salads made with organic, locally-sourced ingredients.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 650,
    deliveryTime: "15-25 min",
    deliveryFee: 2.49,
    minOrder: 10,
    cuisine: ["Healthy", "Salads", "Vegan"],
    isOpen: true,
    address: "321 Wellness Way",
  },
  {
    id: "prov-5",
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    description: "Authentic Mexican street food with recipes passed down through generations.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=1200&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 980,
    deliveryTime: "20-30 min",
    deliveryFee: 2.29,
    minOrder: 12,
    cuisine: ["Mexican", "Latin American"],
    isOpen: true,
    address: "555 Sunset Strip",
  },
  {
    id: "prov-6",
    name: "Sweet Dreams Bakery",
    slug: "sweet-dreams-bakery",
    description: "Handcrafted desserts and pastries made fresh daily with premium ingredients.",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1517433670267-30f41c098e5c?w=1200&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 750,
    deliveryTime: "25-35 min",
    deliveryFee: 3.49,
    minOrder: 15,
    cuisine: ["Desserts", "Bakery", "Cafe"],
    isOpen: true,
    address: "888 Sugar Lane",
  },
];

// Meals
export const meals: Meal[] = [
  // Burger Palace meals
  {
    id: "meal-1",
    name: "Classic Smash Burger",
    slug: "classic-smash-burger",
    description: "Double smashed beef patties with melted American cheese, pickles, onions, and our secret sauce on a brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    price: 12.99,
    originalPrice: 15.99,
    category: "Burgers",
    categoryId: "cat-1",
    providerId: "prov-1",
    providerName: "Burger Palace",
    rating: 4.9,
    reviewCount: 324,
    calories: 750,
    prepTime: "12-15 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Beef Patties", "American Cheese", "Pickles", "Onions", "Secret Sauce", "Brioche Bun"],
  },
  {
    id: "meal-2",
    name: "Bacon BBQ Burger",
    slug: "bacon-bbq-burger",
    description: "Juicy beef patty topped with crispy bacon, cheddar cheese, onion rings, and smoky BBQ sauce.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
    price: 14.99,
    category: "Burgers",
    categoryId: "cat-1",
    providerId: "prov-1",
    providerName: "Burger Palace",
    rating: 4.7,
    reviewCount: 256,
    calories: 920,
    prepTime: "15-18 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Beef Patty", "Bacon", "Cheddar Cheese", "Onion Rings", "BBQ Sauce"],
  },
  {
    id: "meal-3",
    name: "Spicy Jalapeño Burger",
    slug: "spicy-jalapeno-burger",
    description: "Fiery beef patty with pepper jack cheese, fresh jalapeños, chipotle mayo, and crispy lettuce.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
    price: 13.49,
    category: "Burgers",
    categoryId: "cat-1",
    providerId: "prov-1",
    providerName: "Burger Palace",
    rating: 4.6,
    reviewCount: 189,
    calories: 680,
    prepTime: "12-15 min",
    isVegetarian: false,
    isSpicy: true,
    isPopular: false,
    ingredients: ["Beef Patty", "Pepper Jack Cheese", "Jalapeños", "Chipotle Mayo", "Lettuce"],
  },
  // Sakura Sushi meals
  {
    id: "meal-4",
    name: "Rainbow Dragon Roll",
    slug: "rainbow-dragon-roll",
    description: "Stunning roll with shrimp tempura inside, topped with a rainbow of fresh sashimi including tuna, salmon, and yellowtail.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
    price: 18.99,
    category: "Sushi",
    categoryId: "cat-3",
    providerId: "prov-2",
    providerName: "Sakura Sushi",
    rating: 4.9,
    reviewCount: 412,
    calories: 420,
    prepTime: "18-22 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Shrimp Tempura", "Tuna", "Salmon", "Yellowtail", "Avocado", "Sushi Rice"],
  },
  {
    id: "meal-5",
    name: "Spicy Tuna Roll",
    slug: "spicy-tuna-roll",
    description: "Fresh tuna mixed with spicy mayo, cucumber, and avocado, topped with sesame seeds.",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop",
    price: 14.99,
    category: "Sushi",
    categoryId: "cat-3",
    providerId: "prov-2",
    providerName: "Sakura Sushi",
    rating: 4.8,
    reviewCount: 298,
    calories: 320,
    prepTime: "15-18 min",
    isVegetarian: false,
    isSpicy: true,
    isPopular: true,
    ingredients: ["Fresh Tuna", "Spicy Mayo", "Cucumber", "Avocado", "Sesame Seeds"],
  },
  {
    id: "meal-6",
    name: "Salmon Sashimi Platter",
    slug: "salmon-sashimi-platter",
    description: "12 pieces of premium Norwegian salmon sashimi, sliced to perfection and served with wasabi and pickled ginger.",
    image: "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=600&h=400&fit=crop",
    price: 22.99,
    category: "Sushi",
    categoryId: "cat-3",
    providerId: "prov-2",
    providerName: "Sakura Sushi",
    rating: 4.9,
    reviewCount: 187,
    calories: 280,
    prepTime: "10-12 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Norwegian Salmon", "Wasabi", "Pickled Ginger", "Soy Sauce"],
  },
  // Pizza Napoli meals
  {
    id: "meal-7",
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    description: "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    price: 16.99,
    category: "Pizza",
    categoryId: "cat-2",
    providerId: "prov-3",
    providerName: "Pizza Napoli",
    rating: 4.8,
    reviewCount: 567,
    calories: 850,
    prepTime: "18-22 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil"],
  },
  {
    id: "meal-8",
    name: "Pepperoni Supreme",
    slug: "pepperoni-supreme",
    description: "Loaded with cup-and-char pepperoni, melted mozzarella, and our signature tomato sauce.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
    price: 18.99,
    category: "Pizza",
    categoryId: "cat-2",
    providerId: "prov-3",
    providerName: "Pizza Napoli",
    rating: 4.7,
    reviewCount: 445,
    calories: 980,
    prepTime: "20-25 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Italian Herbs"],
  },
  {
    id: "meal-9",
    name: "Quattro Formaggi",
    slug: "quattro-formaggi",
    description: "Four cheese heaven with mozzarella, gorgonzola, parmesan, and ricotta on a crispy thin crust.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    price: 19.99,
    category: "Pizza",
    categoryId: "cat-2",
    providerId: "prov-3",
    providerName: "Pizza Napoli",
    rating: 4.8,
    reviewCount: 312,
    calories: 920,
    prepTime: "18-22 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: false,
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Ricotta"],
  },
  // Green Bowl meals
  {
    id: "meal-10",
    name: "Buddha Bowl",
    slug: "buddha-bowl",
    description: "Nourishing bowl with quinoa, roasted chickpeas, avocado, sweet potato, kale, and tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    price: 13.99,
    category: "Salads",
    categoryId: "cat-5",
    providerId: "prov-4",
    providerName: "Green Bowl",
    rating: 4.7,
    reviewCount: 234,
    calories: 480,
    prepTime: "10-12 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Quinoa", "Chickpeas", "Avocado", "Sweet Potato", "Kale", "Tahini"],
  },
  {
    id: "meal-11",
    name: "Grilled Chicken Caesar",
    slug: "grilled-chicken-caesar",
    description: "Crisp romaine lettuce with grilled chicken breast, parmesan, croutons, and house-made Caesar dressing.",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    price: 14.49,
    category: "Salads",
    categoryId: "cat-5",
    providerId: "prov-4",
    providerName: "Green Bowl",
    rating: 4.6,
    reviewCount: 189,
    calories: 420,
    prepTime: "12-15 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    ingredients: ["Romaine Lettuce", "Grilled Chicken", "Parmesan", "Croutons", "Caesar Dressing"],
  },
  {
    id: "meal-12",
    name: "Mediterranean Power Bowl",
    slug: "mediterranean-power-bowl",
    description: "Falafel, hummus, tabbouleh, cucumber, tomatoes, olives, and feta cheese with lemon herb dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
    price: 14.99,
    category: "Salads",
    categoryId: "cat-5",
    providerId: "prov-4",
    providerName: "Green Bowl",
    rating: 4.8,
    reviewCount: 276,
    calories: 520,
    prepTime: "10-12 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Falafel", "Hummus", "Tabbouleh", "Feta Cheese", "Olives", "Cucumber"],
  },
  // Taco Fiesta meals
  {
    id: "meal-13",
    name: "Carne Asada Tacos",
    slug: "carne-asada-tacos",
    description: "Three corn tortilla tacos filled with marinated grilled steak, cilantro, onions, and salsa verde.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    price: 13.99,
    category: "Mexican",
    categoryId: "cat-8",
    providerId: "prov-5",
    providerName: "Taco Fiesta",
    rating: 4.7,
    reviewCount: 345,
    calories: 540,
    prepTime: "12-15 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Corn Tortillas", "Grilled Steak", "Cilantro", "Onions", "Salsa Verde"],
  },
  {
    id: "meal-14",
    name: "Chicken Burrito Bowl",
    slug: "chicken-burrito-bowl",
    description: "Grilled chicken with cilantro lime rice, black beans, corn, pico de gallo, guacamole, and sour cream.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
    price: 14.99,
    category: "Mexican",
    categoryId: "cat-8",
    providerId: "prov-5",
    providerName: "Taco Fiesta",
    rating: 4.6,
    reviewCount: 287,
    calories: 680,
    prepTime: "10-12 min",
    isVegetarian: false,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Grilled Chicken", "Cilantro Lime Rice", "Black Beans", "Guacamole", "Pico de Gallo"],
  },
  {
    id: "meal-15",
    name: "Spicy Carnitas Quesadilla",
    slug: "spicy-carnitas-quesadilla",
    description: "Crispy flour tortilla stuffed with slow-cooked carnitas, melted cheese, jalapeños, and chipotle crema.",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&h=400&fit=crop",
    price: 12.99,
    category: "Mexican",
    categoryId: "cat-8",
    providerId: "prov-5",
    providerName: "Taco Fiesta",
    rating: 4.5,
    reviewCount: 198,
    calories: 720,
    prepTime: "10-12 min",
    isVegetarian: false,
    isSpicy: true,
    isPopular: false,
    ingredients: ["Flour Tortilla", "Carnitas", "Cheese", "Jalapeños", "Chipotle Crema"],
  },
  // Sweet Dreams Bakery
  {
    id: "meal-16",
    name: "Chocolate Lava Cake",
    slug: "chocolate-lava-cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop",
    price: 8.99,
    category: "Desserts",
    categoryId: "cat-6",
    providerId: "prov-6",
    providerName: "Sweet Dreams Bakery",
    rating: 4.9,
    reviewCount: 456,
    calories: 520,
    prepTime: "15-18 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Vanilla Ice Cream", "Fresh Berries"],
  },
  {
    id: "meal-17",
    name: "New York Cheesecake",
    slug: "new-york-cheesecake",
    description: "Creamy classic cheesecake with a graham cracker crust, topped with strawberry compote.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop",
    price: 7.99,
    category: "Desserts",
    categoryId: "cat-6",
    providerId: "prov-6",
    providerName: "Sweet Dreams Bakery",
    rating: 4.8,
    reviewCount: 324,
    calories: 450,
    prepTime: "5-8 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Cream Cheese", "Graham Cracker", "Eggs", "Strawberry Compote"],
  },
  {
    id: "meal-18",
    name: "Tiramisu",
    slug: "tiramisu",
    description: "Italian classic with layers of espresso-soaked ladyfingers and mascarpone cream, dusted with cocoa.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
    price: 9.49,
    category: "Desserts",
    categoryId: "cat-6",
    providerId: "prov-6",
    providerName: "Sweet Dreams Bakery",
    rating: 4.9,
    reviewCount: 287,
    calories: 380,
    prepTime: "5-8 min",
    isVegetarian: true,
    isSpicy: false,
    isPopular: true,
    ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Cocoa Powder"],
  },
];

// Reviews
export const reviews: Review[] = [
  {
    id: "rev-1",
    mealId: "meal-1",
    userId: "user-1",
    userName: "Sarah Johnson",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    rating: 5,
    comment: "Best burger I've ever had! The secret sauce is incredible.",
    date: "2024-01-15",
  },
  {
    id: "rev-2",
    mealId: "meal-1",
    userId: "user-2",
    userName: "Mike Chen",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    rating: 5,
    comment: "Perfectly cooked patties and the brioche bun is so soft!",
    date: "2024-01-12",
  },
  {
    id: "rev-3",
    mealId: "meal-4",
    userId: "user-3",
    userName: "Emily Wong",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    rating: 5,
    comment: "The freshness of the fish is unmatched. Absolutely divine!",
    date: "2024-01-18",
  },
  {
    id: "rev-4",
    mealId: "meal-7",
    userId: "user-4",
    userName: "David Kim",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
    rating: 4,
    comment: "Authentic Neapolitan style. Reminds me of my trip to Italy.",
    date: "2024-01-20",
  },
  {
    id: "rev-5",
    mealId: "meal-10",
    userId: "user-5",
    userName: "Lisa Park",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop",
    rating: 5,
    comment: "So healthy and delicious! The tahini dressing is perfect.",
    date: "2024-01-22",
  },
];

// Orders (Mock data for order history and admin)
export const orders: Order[] = [
  {
    id: "order-1",
    userId: "user-customer-1",
    userName: "John Customer",
    userEmail: "customer@foodhub.com",
    userPhone: "+1 (555) 123-4567",
    items: [
      { mealId: "meal-1", mealName: "Classic Smash Burger", quantity: 2, price: 12.99 },
      { mealId: "meal-2", mealName: "Bacon BBQ Burger", quantity: 1, price: 14.99 },
    ],
    subtotal: 40.97,
    deliveryFee: 2.99,
    total: 43.96,
    status: "delivered",
    deliveryAddress: "123 Customer Street, Apt 4B, New York, NY 10001",
    paymentMethod: "cash",
    providerId: "prov-1",
    providerName: "Burger Palace",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T15:45:00Z",
  },
  {
    id: "order-2",
    userId: "user-customer-1",
    userName: "John Customer",
    userEmail: "customer@foodhub.com",
    userPhone: "+1 (555) 123-4567",
    items: [
      { mealId: "meal-4", mealName: "Rainbow Dragon Roll", quantity: 1, price: 18.99 },
      { mealId: "meal-5", mealName: "Spicy Tuna Roll", quantity: 2, price: 14.99 },
    ],
    subtotal: 48.97,
    deliveryFee: 3.99,
    total: 52.96,
    status: "preparing",
    deliveryAddress: "123 Customer Street, Apt 4B, New York, NY 10001",
    paymentMethod: "cash",
    providerId: "prov-2",
    providerName: "Sakura Sushi",
    createdAt: "2024-01-25T12:00:00Z",
    updatedAt: "2024-01-25T12:15:00Z",
  },
  {
    id: "order-3",
    userId: "user-6",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    userPhone: "+1 (555) 234-5678",
    items: [
      { mealId: "meal-7", mealName: "Margherita Pizza", quantity: 2, price: 16.99 },
    ],
    subtotal: 33.98,
    deliveryFee: 1.99,
    total: 35.97,
    status: "placed",
    deliveryAddress: "456 Oak Avenue, Suite 12, New York, NY 10002",
    paymentMethod: "cash",
    providerId: "prov-3",
    providerName: "Pizza Napoli",
    createdAt: "2024-01-26T18:30:00Z",
    updatedAt: "2024-01-26T18:30:00Z",
  },
  {
    id: "order-4",
    userId: "user-7",
    userName: "James Brown",
    userEmail: "james@example.com",
    userPhone: "+1 (555) 345-6789",
    items: [
      { mealId: "meal-10", mealName: "Buddha Bowl", quantity: 1, price: 13.99 },
      { mealId: "meal-12", mealName: "Mediterranean Power Bowl", quantity: 1, price: 14.99 },
    ],
    subtotal: 28.98,
    deliveryFee: 2.49,
    total: 31.47,
    status: "ready",
    deliveryAddress: "789 Pine Street, New York, NY 10003",
    paymentMethod: "cash",
    providerId: "prov-4",
    providerName: "Green Bowl",
    createdAt: "2024-01-26T17:00:00Z",
    updatedAt: "2024-01-26T17:45:00Z",
  },
  {
    id: "order-5",
    userId: "user-8",
    userName: "Sophia Martinez",
    userEmail: "sophia@example.com",
    userPhone: "+1 (555) 456-7890",
    items: [
      { mealId: "meal-13", mealName: "Carne Asada Tacos", quantity: 3, price: 13.99 },
      { mealId: "meal-15", mealName: "Spicy Carnitas Quesadilla", quantity: 1, price: 12.99 },
    ],
    subtotal: 54.96,
    deliveryFee: 2.29,
    total: 57.25,
    status: "cancelled",
    deliveryAddress: "321 Maple Drive, New York, NY 10004",
    paymentMethod: "cash",
    providerId: "prov-5",
    providerName: "Taco Fiesta",
    createdAt: "2024-01-24T20:00:00Z",
    updatedAt: "2024-01-24T20:10:00Z",
  },
  {
    id: "order-6",
    userId: "user-9",
    userName: "Oliver Davis",
    userEmail: "oliver@example.com",
    userPhone: "+1 (555) 567-8901",
    items: [
      { mealId: "meal-16", mealName: "Chocolate Lava Cake", quantity: 2, price: 8.99 },
      { mealId: "meal-17", mealName: "New York Cheesecake", quantity: 2, price: 7.99 },
      { mealId: "meal-18", mealName: "Tiramisu", quantity: 1, price: 9.49 },
    ],
    subtotal: 43.45,
    deliveryFee: 3.49,
    total: 46.94,
    status: "delivered",
    deliveryAddress: "654 Elm Street, Apt 8C, New York, NY 10005",
    paymentMethod: "cash",
    providerId: "prov-6",
    providerName: "Sweet Dreams Bakery",
    createdAt: "2024-01-23T19:30:00Z",
    updatedAt: "2024-01-23T20:30:00Z",
  },
];

// Admin Users List
export const adminUsers: AdminUser[] = [
  {
    id: "user-admin-1",
    name: "Admin User",
    email: "admin@foodhub.com",
    phone: "+1 (555) 000-0001",
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    createdAt: "2024-01-01",
  },
  {
    id: "user-customer-1",
    name: "John Customer",
    email: "customer@foodhub.com",
    phone: "+1 (555) 123-4567",
    role: "customer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    createdAt: "2024-06-15",
    ordersCount: 12,
    totalSpent: 458.90,
  },
  {
    id: "user-provider-1",
    name: "Chef Marco",
    email: "provider@foodhub.com",
    phone: "+1 (555) 987-6543",
    role: "provider",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop",
    createdAt: "2024-03-10",
    restaurantName: "Burger Palace",
  },
  {
    id: "user-6",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 (555) 234-5678",
    role: "customer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    createdAt: "2024-07-20",
    ordersCount: 8,
    totalSpent: 234.50,
  },
  {
    id: "user-7",
    name: "James Brown",
    email: "james@example.com",
    phone: "+1 (555) 345-6789",
    role: "customer",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    createdAt: "2024-05-05",
    ordersCount: 15,
    totalSpent: 567.80,
  },
  {
    id: "user-8",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    phone: "+1 (555) 456-7890",
    role: "customer",
    status: "suspended",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    createdAt: "2024-08-12",
    ordersCount: 3,
    totalSpent: 89.25,
  },
  {
    id: "user-prov-2",
    name: "Chef Yuki",
    email: "yuki@sakurasushi.com",
    phone: "+1 (555) 876-5432",
    role: "provider",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=100&h=100&fit=crop",
    createdAt: "2024-02-28",
    restaurantName: "Sakura Sushi",
  },
  {
    id: "user-prov-3",
    name: "Chef Giovanni",
    email: "giovanni@pizzanapoli.com",
    phone: "+1 (555) 765-4321",
    role: "provider",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1583394293214-28ez052c9266?w=100&h=100&fit=crop",
    createdAt: "2024-04-15",
    restaurantName: "Pizza Napoli",
  },
];

// Provider's own orders (filtered for provider dashboard)
export const getProviderOrders = (providerId: string) => {
  return orders.filter((order) => order.providerId === providerId);
};

// Customer's own orders (filtered for customer)
export const getCustomerOrders = (userId: string) => {
  return orders.filter((order) => order.userId === userId);
};

// Provider's menu items
export const getProviderMeals = (providerId: string) => {
  return meals.filter((meal) => meal.providerId === providerId);
};

// Helper functions used by pages
export const getPopularMeals = () => {
  return meals.filter((meal) => meal.isPopular);
};

export const getMealById = (id: string) => {
  return meals.find((meal) => meal.id === id);
};

export const getMealsByProvider = (providerId: string) => {
  return meals.filter((meal) => meal.providerId === providerId);
};

export const getReviewsByMealId = (mealId: string) => {
  return reviews.filter((review) => review.mealId === mealId);
};

export const getProviderById = (id: string) => {
  return providers.find((provider) => provider.id === id);
};

export const searchMeals = (query: string) => {
  const searchTerm = query.toLowerCase();
  return meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchTerm) ||
      meal.description.toLowerCase().includes(searchTerm) ||
      meal.category.toLowerCase().includes(searchTerm) ||
      meal.providerName.toLowerCase().includes(searchTerm)
  );
};
