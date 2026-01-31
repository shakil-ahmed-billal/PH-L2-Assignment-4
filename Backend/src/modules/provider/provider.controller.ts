import { Request, Response } from "express";
import { providerService } from "./provider.service";

// get provider meal by  provider id

const getProviderMealById = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;

    const meals = await providerService.getProviderMealByIdService(
      providerId as string,
    );

    res.status(200).json({
      success: true,
      message: "Provider meals retrieved successfully",
      data: meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
};

const getOrderByProviderId = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const orders = await providerService.getOrderByProviderId(
      providerId as string,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};


const getProviderStats = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.id;
    const stats = await providerService.getProviderStats(providerId as string);
    res
      .status(200)
      .json({ success: true, message: "Stats retrieved successfully", data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const providerController = {
  getProviderMealById,
  getOrderByProviderId,
  getProviderStats
};
