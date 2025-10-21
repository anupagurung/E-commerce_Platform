// src/routes/orderRoutes.js
import express from "express";
import { 
  createOrder,
  getOrderById,
  getUserOrders,
  orderPayment,
  confirmOrderPayment
} from "../controllers/orderController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Any logged-in user can create an order
router.post("/", auth, createOrder);

// User can view their own orders
router.get("/myorders/:userId", auth, getUserOrders);

// User can view a specific order
router.get("/:id", auth, getOrderById);

// Payment routes
router.post("/:id/payment", auth, orderPayment);
router.put("/:id/payment", auth, confirmOrderPayment);

export default router;  // ✅ ESM default export
