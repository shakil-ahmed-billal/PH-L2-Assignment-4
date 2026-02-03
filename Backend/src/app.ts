import { auth } from './../lib/auth';
import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv'
import router from "./router";
import envConfig from "./config/envConfig";
dotenv.config();






const app:Application = express();


const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      const isAllowed = allowedOrigins.includes(origin)
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(morgan("dev"))
app.use("/api" , router)


app.all("/api/auth/*splat", toNodeHandler(auth));



app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    message: 'Welcome to the Meal Delivery Service API',
    endpoint: {
      "user login POST" : "/api/auth/signin/email",
      "user register POST" : "/api/auth/signup/email",
      "meals get all GET" : "/api/meals",
      "meal get by id GET" : "/api/meals/:id",
      "meal create POST" : "/api/meals",
      "meal update PUT" : "/api/meals/:id",
      "meal delete DELETE" : "/api/meals/:id",
      "meal reviews GET" : "/api/meals/:id/reviews",
      "meal related GET" : "/api/meals/:id/related",
      "add meal review POST" : "/api/meals/:id/reviews",
      "categories GET" : "/api/cat",
      "orders GET" : "/api/order",
      "providers GET" : "/api/provider",
      "admin GET" : "/api/admin",
      "restaurant GET" : "/api/restaurant",
      "review GET" : "/api/review",
    }

  });
});


export default app