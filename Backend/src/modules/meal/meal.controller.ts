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

    const result = await mealService.createMeal(req.body)

    res.status(200).send({
        success:  true ,
        message: "" , 
        data: result
    })
} 

const getMealById = async (req: Request , res:Response) =>{

    const {id} = req.params ;

    try{

        const result = await mealService.getMealById(id as string)

        res.status(200).send({
            success: true ,
            message: "" ,
            data: result
        })

    }catch(error){
        res.status(500).send({
            success: true ,
            message: error ,
            error: error 
        })
    }
}



export const mealController = {
    getAllMeal,
    createMeal,
    getMealById
}