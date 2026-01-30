import { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

const getAllMeal = async () => {
  try {
    const result = await prisma.meal.findMany();

    return result;
  } catch (error) {
    throw new Error("Get All Meal Api error");
  }
};

const createMeal = async (data: Meal) => {
  //   const {
  //     name,
  //     slug,
  //     description,
  //     image,
  //     price,
  //     originalPrice,
  //     categoryId,
  //     calories,
  //     prepTime,
  //     isVegetarian,
  //     isPopular,
  //     isSpicy,
  //     ingredients,
  //     providerId,
  //   } = payload || {};

  console.log(data);

  try {
    const result = await prisma.meal.create({
      data,
    });

    return result;
  } catch (err) {
    throw new Error("Meal Create error");
  }
};

export const mealService = {
  getAllMeal,
  createMeal
};
