import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import authRoutes from "./routes/authRoutes.js";
import config from "./config/config.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import logger from "./middleware/logger.js";

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

app.get("/", (req, res) => {
  res.send("Welcome to the Rare You E-commerce API!");
});

const PORT = config.port || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
