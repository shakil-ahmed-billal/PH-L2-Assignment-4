import { Router } from "express";
import { adminController } from "./admin.Controller";

const router: Router = Router();

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);

// Orders
router.get('/orders', adminController.getAllOrders);

// Categories
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:categoryId', adminController.updateCategory);
router.delete('/categories/:categoryId', adminController.deleteCategory);

// Meals
router.get('/meals', adminController.getAllMeals);

export const adminRouter = router;