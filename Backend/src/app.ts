import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
import auth from '../lib/auth'
import router from "./router";
import envConfig from "./config/envConfig";
dotenv.config();






const app:Application = express();

app.use(cors({
    origin: envConfig.CLIENT_URL || "http://localhost:3000",
    credentials: true
}))
app.use(express.json());
app.use(morgan("dev"))
app.use("/api" , router)


app.all("/api/auth/*splat", toNodeHandler(auth));



app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString() });
});

export default app