// express-api/src/app.js

import dotenv from "dotenv";
import path from 'path'; 

const envPath = path.resolve(process.cwd(), '.env');
console.log("Attempting to load .env from:", envPath); 
dotenv.config({ path: envPath });

console.log("process.env.MONGO_URI after dotenv.config():", process.env.MONGO_URI);



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import logger from "./middleware/logger.js";
import paymentRoutes from './routes/paymentRoutes.js';

import { initializeConfig, cloudinary } from "./config/config.js";
const config = initializeConfig();

console.log("Config object (after initialization):", config);
console.log("MongoDB URI from config (after initialization):", config.mongoURI);
console.log("Current working directory:", process.cwd());
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(logger);

mongoose
  .connect(config.mongoURI) 
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/payments', paymentRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Rare You E-commerce API!");
});

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));