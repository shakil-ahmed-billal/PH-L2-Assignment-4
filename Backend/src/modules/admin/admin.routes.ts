import { Router } from "express";
import { adminController } from "./admin.Controller";
import auth, { UserRole } from "../../middlewares/auth";
const router: Router = Router();

// Dashboard
router.get('/dashboard', auth(UserRole.ADMIN), adminController.getDashboardStats);

// Users
router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers);
router.put('/users/:userId/status', auth(UserRole.ADMIN), adminController.updateUserStatus);

// Orders
router.get('/orders', auth(UserRole.ADMIN), adminController.getAllOrders);

// Categories
router.get('/categories', auth(UserRole.ADMIN), adminController.getAllCategories);
router.post('/categories', auth(UserRole.ADMIN), adminController.createCategory);
router.put('/categories/:categoryId', auth(UserRole.ADMIN), adminController.updateCategory);
router.delete('/categories/:categoryId', auth(UserRole.ADMIN), adminController.deleteCategory);

// Meals
router.get('/meals', auth(UserRole.ADMIN), adminController.getAllMeals);

export const adminRouter = router;