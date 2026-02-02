# 🍱 FoodHub  
### Discover & Order Delicious Meals

FoodHub is a full-stack meal ordering platform where customers can explore food from multiple providers, place orders, and leave reviews. Providers can manage their menus and orders, while admins oversee the entire system.

---

## 📌 Project Overview

FoodHub connects **customers**, **food providers**, and **admins** in a single platform.

- Customers browse meals, place orders, and track deliveries  
- Providers manage menus and fulfill orders  
- Admins manage users, categories, and platform activity  

The project is designed with role-based access control, scalable APIs, and a modern full-stack architecture.
> ℹ️ Users select their role during registration.  
> Admin accounts are pre-seeded.

---

## 👥 Roles & Permissions

| Role | Description | Permissions |
|-----|------------|-------------|
| **Customer** | Meal buyers | Browse meals, place orders, track status, leave reviews |
| **Provider** | Food sellers / restaurants | Manage meals, view orders, update order status |
| **Admin** | Platform controller | Manage users, categories, and all orders |

> ℹ️ Users select **Customer** or **Provider** role during registration.  
> Admin users are created manually or seeded in the database.
## 🔐 Demo Credentials

### Admin
- **Email:** admin@gmail.com  
- **Password:** shakil664  

### Provider
- **Email:** provider@gmail.com  
- **Password:** shakil664  

### Customer
- **Email:** customer@gmail.com  
- **Password:** shakil664  

---

- **Frontend Live**  
  https://foodhub-bd.vercel.app  

- **Backend Live API**  
  https://api-foobhub.vercel.app  

## 🧰 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- Shadcn UI

**Backend**
- Node.js
- Prisma ORM
- PostgreSQL
- REST APIs

**Authentication**
- Better Auth (Email & Social Login)

**Tools**
- Prisma Studio
- Git & GitHub
- Vercel (Frontend Deployment)

---

## ✨ Features

### 🌐 Public Features
- Browse all meals and providers
- View provider profiles
- Filter meals by category and preferences

### 🧑‍🍽️ Customer Features
- Register & login
- Add meals to cart
- Place orders (Cash on Delivery)
- Track order status
- Leave reviews after delivery
- View order history

### 🍳 Provider Features
- Register & login
- Create and manage meals
- View incoming orders
- Update order status (Preparing, Ready, Delivered)

### 🛡️ Admin Features
- View all users
- Manage user roles and status
- Manage categories
- View all orders

---

## 🗺️ Pages & Routes

### Public Routes

| Route | Description |
|------|------------|
| `/` | Home |
| `/meals` | Browse meals |
| `/meals/:id` | Meal details |
| `/providers/:id` | Provider profile |
| `/login` | Login |
| `/register` | Registration |

### Customer Routes (Protected)

| Route | Description |
|------|------------|
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/orders` | Order history |
| `/orders/:id` | Order details |
| `/profile` | Profile |

### Provider Routes (Protected)

| Route | Description |
|------|------------|
| `/provider/dashboard` | Dashboard |
| `/provider/menu` | Manage meals |
| `/provider/orders` | Manage orders |

### Admin Routes (Protected)

| Route | Description |
|------|------------|
| `/admin` | Admin dashboard |
| `/admin/users` | Manage users |
| `/admin/orders` | All orders |
| `/admin/categories` | Manage categories |

---

## 🗄️ Database Models

Main tables used in this project:

- **User** – Authentication & role management  
- **ProviderProfile** – Provider-specific details  
- **Category** – Meal categories  
- **Meal** – Provider menu items  
- **Order** – Customer orders  
- **OrderItem** – Meals inside an order  
- **Review** – Customer reviews for meals  

Relational integrity is maintained using Prisma relations.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint |
|------|---------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

### Meals & Providers

| Method | Endpoint |
|------|---------|
| GET | `/api/meals` |
| GET | `/api/meals/:id` |
| GET | `/api/providers` |
| GET | `/api/providers/:id` |

### Orders

| Method | Endpoint |
|------|---------|
| POST | `/api/orders` |
| GET | `/api/orders` |
| GET | `/api/orders/:id` |

### Provider

| Method | Endpoint |
|------|---------|
| POST | `/api/provider/meals` |
| PUT | `/api/provider/meals/:id` |
| DELETE | `/api/provider/meals/:id` |
| PATCH | `/api/provider/orders/:id` |

### Admin

| Method | Endpoint |
|------|---------|
| GET | `/api/admin/users` |
| PATCH | `/api/admin/users/:id` |

---

## 🔄 Order Flow

