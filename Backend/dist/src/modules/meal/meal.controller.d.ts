import { Request, Response } from "express";
export declare const mealController: {
    getAllMeals: (req: Request, res: Response) => Promise<void>;
    getMealById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getMealReviews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getRelatedMeals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createMeal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateMeal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteMeal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    addMealReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=meal.controller.d.ts.map