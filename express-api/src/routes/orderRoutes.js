import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "../controllers/orderController.js";
import Order from "../models/order.js"; // ✅ Add this for direct user updates

const router = express.Router();

/* ---------------------------- USER ROUTES ---------------------------- */

// Create new order
router.post("/", auth, createOrderController);

// Get logged-in user's orders
router.get("/myorders", auth, getUserOrdersController);

// ✅ User: Update own order status (for Cash on Delivery)
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // Find the order owned by this user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus || "Processing";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ User: Delete own order
router.delete("/:orderId", auth, deleteOrderController);

/* ---------------------------- ADMIN ROUTES ---------------------------- */

// Admin: Get all orders
router.get("/", auth, getAllOrdersController);

// Admin: Update any order status (use different endpoint to avoid conflict)
router.put("/:orderId/status/admin", auth, updateOrderStatusController);

export default router;
