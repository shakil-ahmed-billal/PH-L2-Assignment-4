import { Request, Response } from "express";
export declare const providerController: {
    getProviderStats: (req: Request, res: Response) => Promise<void>;
    getProviderDashboard: (req: Request, res: Response) => Promise<void>;
    getProviderProfile: (req: Request, res: Response) => Promise<void>;
    updateProviderProfile: (req: Request, res: Response) => Promise<void>;
    getRevenueAnalytics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTopSellingMeals: (req: Request, res: Response) => Promise<void>;
    getOrderByProviderId: (req: Request, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    cancelOrder: (req: Request, res: Response) => Promise<void>;
    getProviderMealById: (req: Request, res: Response) => Promise<void>;
    createMeal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateMeal: (req: Request, res: Response) => Promise<void>;
    deleteMeal: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=provider.controller.d.ts.map