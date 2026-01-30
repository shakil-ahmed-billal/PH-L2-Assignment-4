import { mealService } from "./meal.service"
import {Request , Response} from 'express'







const getAllMeal = async(req:Request , res:Response) =>{


    const result = await mealService.getAllMeal()


    res.status(200).send({
        success: true ,
        message: "" ,
        data: result 
    })


}




const createMeal = async(req:Request , res:Response) =>{

    const result = await 

    res.status(200).send({
        success:  true ,
        message: "" , 
        data: result
    })
}



export const mealController = {
    getAllMeal
}