
import {Request , Response} from 'express'
import { orderService } from './order.service'



const createNewOrder = async (req: Request, res: Response) => {
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
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the order",
            error: err
        });
    }
};

const getOrderById = async (req:Request , res:Response) =>{
    const {id} = req.params ;

    console.log("test" ,id)

    const result = await orderService.getMyOrder (id as string )

    res.status(200).send({
        success: true ,
        message: "" ,
        data: result ,
    })
}


export const orderController = {
    createNewOrder,
    getOrderById
}
