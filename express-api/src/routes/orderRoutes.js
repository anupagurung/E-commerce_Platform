import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";

const router = express.Router();

// User routes
router.post("/", auth, createOrderController);
router.get("/myorders", auth, getUserOrdersController);

// Admin routes
router.get("/", auth, getAllOrdersController);
router.put("/:orderId/status", auth, updateOrderStatusController); // update order status

export default router;
