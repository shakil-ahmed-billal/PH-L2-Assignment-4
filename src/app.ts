import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
import auth from '../lib/auth'
dotenv.config();






const app:Application = express();

app.use(cors())
app.use(express.json());
app.use(morgan("dev"))

app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/" , (req , res)=>{
    res.send("Server is running")
})

export default app