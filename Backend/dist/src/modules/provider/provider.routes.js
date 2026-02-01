import { Router } from "express";
import { providerController } from "./provider.controller";
const router = Router();
// Stats & Dashboard
router.get('/stats/:id', providerController.getProviderStats);
router.get('/dashboard/:id', providerController.getProviderDashboard);
router.get('/profile/:id', providerController.getProviderProfile);
router.put('/profile/:id', providerController.updateProviderProfile);
router.get('/analytics/:id/revenue', providerController.getRevenueAnalytics);
router.get('/analytics/:id/top-meals', providerController.getTopSellingMeals);
// Orders
router.get('/orders/:id', providerController.getOrderByProviderId);
router.put('/orders/:orderId/status', providerController.updateOrderStatus);
router.put('/orders/:orderId/cancel', providerController.cancelOrder);
// Meals
router.post('/meals', providerController.createMeal);
router.put('/meals/:mealId', providerController.updateMeal);
router.delete('/meals/:mealId', providerController.deleteMeal);
export const providerRouter = router;
//# sourceMappingURL=provider.routes.js.map