import { Request, Response } from "express";
export declare const restaurantController: {
    getAllRestaurant: (req: Request, res: Response) => Promise<void>;
    getRestaurantById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getRestaurantMeals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getRestaurantReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=restaurant.controller.d.ts.map