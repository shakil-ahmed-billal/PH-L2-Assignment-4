import { Request, Response } from "express";
export declare const reviewController: {
    getCustomerOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getOrderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    addOrderReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteOrderReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getProviderOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=review.controller.d.ts.map