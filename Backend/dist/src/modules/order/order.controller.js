import { orderService } from './order.service';
const createNewOrder = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).send({
                success: false,
                message: "Invalid data format"
            });
        }
        const result = await orderService.createNewOrder(data);
        res.status(200).send({
            success: true,
            message: "Order created successfully",
            data: result
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the order",
            error: err
        });
    }
};
const getOrderById = async (req, res) => {
    const { id } = req.params;
    console.log("test", id);
    const result = await orderService.getMyOrder(id);
    res.status(200).send({
        success: true,
        message: "",
        data: result,
    });
};
export const orderController = {
    createNewOrder,
    getOrderById
};
//# sourceMappingURL=order.controller.js.map