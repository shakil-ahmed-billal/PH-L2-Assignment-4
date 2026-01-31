import { Router } from "express";
import { providerController } from "./provider.controller";



const router:Router = Router();


router.get('/meal/:id',  providerController.getProviderMealById);
router.get('/orders/:id', providerController.getOrderByProviderId);
router.get('/stats/:id', providerController.getProviderStats);


export const providerRouter = router ;