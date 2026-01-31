import { prisma } from "../../../lib/prisma"


const getAllCategory = async() =>{

    
    try {
        const result = await prisma.category.findMany()
        return result 
    }catch (error){
        throw new Error ("Category Fetch error")
    }


}


export const categoryService = {
    getAllCategory
}