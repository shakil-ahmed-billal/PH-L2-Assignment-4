import { Router } from "express";
import { categoryController } from "./category.controller";



const router : Router = Router() ;

router.get("/categorys" , categoryController.getAllCategory)


export const categoryRoute = router ; 