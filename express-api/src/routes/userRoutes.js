import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
} from "../controllers/orderController.js";

const router = express.Router();

// Create a new order (authenticated)
router.post("/", auth, createOrderController);

// Get logged-in user's orders
router.get("/myorders", auth, getUserOrdersController);

// Get all orders (for admin)
router.get("/", auth, getAllOrdersController);

export default router;
