import { Router } from "express";
import { providerController } from "./provider.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router: Router = Router();

// Stats & Dashboard
router.get('/stats/:id',auth(UserRole.PROVIDER) , providerController.getProviderStats);
router.get('/dashboard/:id',auth(UserRole.PROVIDER) , providerController.getProviderDashboard);
router.get('/profile/:id' , providerController.getProviderProfile);
router.put('/profile/:id',auth(UserRole.PROVIDER) ,providerController.updateProviderProfile);
router.get('/analytics/:id/revenue',auth(UserRole.PROVIDER) ,providerController.getRevenueAnalytics);
router.get('/analytics/:id/top-meals',auth(UserRole.PROVIDER) , providerController.getTopSellingMeals);

// Orders
router.get('/orders/:id',auth(UserRole.PROVIDER) , providerController.getOrderByProviderId);
router.put('/orders/:orderId/status',auth(UserRole.PROVIDER), providerController.updateOrderStatus);
router.put('/orders/:orderId/cancel',auth(UserRole.PROVIDER),providerController.cancelOrder);

// Meals
router.post('/meals',auth(UserRole.PROVIDER) ,providerController.createMeal);
router.put('/meals/:mealId',auth(UserRole.PROVIDER) , providerController.updateMeal);
router.delete('/meals/:mealId',auth(UserRole.PROVIDER) , providerController.deleteMeal);

export const providerRouter = router;