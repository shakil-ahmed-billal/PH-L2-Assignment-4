import { Request, Response } from "express";
import { authService } from "./auth.service";

const providerRegister = async (req: Request, res: Response) => {

    const data = req.body;

    const createProvider = await authService.providerCreate(data)

    res.status(200).json({
        success: true ,
        message: "",
        data: createProvider
    })
};


export const authController = {
    providerRegister,
}
