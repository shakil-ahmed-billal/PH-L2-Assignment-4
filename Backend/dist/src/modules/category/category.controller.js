import { categoryService } from './category.service';
const getAllCategory = async (req, res) => {
    const result = await categoryService.getAllCategory();
    res.status(200).send({
        success: true,
        message: "Get All Category",
        data: result
    });
};
const createMeal = async () => {
    // const result = await 
};
export const categoryController = {
    getAllCategory
};
//# sourceMappingURL=category.controller.js.map