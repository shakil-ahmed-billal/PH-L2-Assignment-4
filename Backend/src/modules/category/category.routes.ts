import { Router } from "express";
import { categoryController } from "./category.controller";



const router : Router = Router() ;

router.get("/category" , categoryController.getAllCategory)


export const categoryRoute = router ; 