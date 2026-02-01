import { adminService } from "./admin.Service";
/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Get all users
 * GET /api/admin/users?role=all
 */
const getAllUsers = async (req, res) => {
    try {
        const role = req.query.role;
        const users = await adminService.getAllUsers(role);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Update user status
 * PUT /api/admin/users/:userId/status
 * Body: { status: string }
 */
const updateUserStatus = async (req, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        const { status } = req.body;
        if (!userId || !status) {
            return res.status(400).json({
                success: false,
                message: "User ID and status are required",
            });
        }
        const user = await adminService.updateUserStatus(userId, status);
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Get all orders
 * GET /api/admin/orders?status=all
 */
const getAllOrders = async (req, res) => {
    try {
        const status = req.query.status;
        const orders = await adminService.getAllOrders(status);
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Get all categories
 * GET /api/admin/categories
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await adminService.getAllCategories();
        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Create a new category
 * POST /api/admin/categories
 * Body: { name, icon, image }
 */
const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        if (!categoryData.name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        const category = await adminService.createCategory(categoryData);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Update a category
 * PUT /api/admin/categories/:categoryId
 * Body: { name?, icon?, image? }
 */
const updateCategory = async (req, res) => {
    try {
        const categoryId = Array.isArray(req.params.categoryId) ? req.params.categoryId[0] : req.params.categoryId;
        const categoryData = req.body;
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }
        const category = await adminService.updateCategory(categoryId, categoryData);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
/**
 * Delete a category
 * DELETE /api/admin/categories/:categoryId
 */
const deleteCategory = async (req, res) => {
    try {
        const categoryId = Array.isArray(req.params.categoryId) ? req.params.categoryId[0] : req.params.categoryId;
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }
        const result = await adminService.deleteCategory(categoryId);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
            error: error,
        });
    }
};
/**
 * Get all meals
 * GET /api/admin/meals
 */
const getAllMeals = async (req, res) => {
    try {
        const meals = await adminService.getAllMeals();
        res.status(200).json({
            success: true,
            message: "Meals retrieved successfully",
            data: meals,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error,
        });
    }
};
export const adminController = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllOrders,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllMeals,
};
//# sourceMappingURL=admin.Controller.js.map