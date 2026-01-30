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
  try {
  const result = await prisma.meal.createMany({
    data,
  });
  return result;
} catch (err) {
  console.error(err); // Log the actual error to get more information
  throw new Error("Meal Create error");
}
};

const getMealById =async (id : string) =>{
  try{
    const result =await prisma.meal.findUnique({
      where: {
        id: id
      }
    })

    return result ;
  }catch(error){
    throw new Error ("Meal Details find fail")
  }
}

export const mealService = {
  getAllMeal,
  createMeal,
  getMealById
};
