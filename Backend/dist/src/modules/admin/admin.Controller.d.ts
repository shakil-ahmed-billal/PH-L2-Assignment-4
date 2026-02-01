import { Request, Response } from "express";
export declare const adminController: {
    getDashboardStats: (req: Request, res: Response) => Promise<void>;
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    updateUserStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    getAllCategories: (req: Request, res: Response) => Promise<void>;
    createCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllMeals: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=admin.Controller.d.ts.map