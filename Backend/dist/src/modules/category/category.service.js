import { prisma } from "../../../lib/prisma";
const getAllCategory = async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        // Get meal count for each category
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const mealCount = await prisma.meal.count({
                where: {
                    categoryId: category.id,
                    available: true,
                },
            });
            return {
                ...category,
                mealCount,
            };
        }));
        return categoriesWithCount;
    }
    catch (err) {
        console.error("Error in getAllCategories:", err);
        throw new Error("Error fetching categories");
    }
};
export const categoryService = {
    getAllCategory
};
//# sourceMappingURL=category.service.js.map