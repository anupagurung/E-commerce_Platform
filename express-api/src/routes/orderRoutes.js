import express from "express";
// Corrected: Import both auth and authorizeRoles from the same statement
import { auth, authorizeRoles } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "../controllers/orderController.js";
import Order from "../models/order.js"; // Make sure the path to your Order model is correct

const router = express.Router();

// 1. Create a new order (authenticated user)
router.post("/", auth, createOrderController);

// 2. Get logged-in user's orders (authenticated user)
// Renamed to '/me' for consistency, assuming controller uses req.user._id
router.get("/me", auth, getUserOrdersController);

// 3. Update order status by a regular user (if allowed)
// This route allows a user to update their OWN order's status (e.g., cancel, if your logic supports it)
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // IMPORTANT: Verify the order belongs to the authenticated user (req.user._id)
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      // If order not found OR not owned by the user, return 404/403
      return res.status(404).json({ success: false, message: "Order not found or not authorized" });
    }

    // You might want to add validation here for which statuses a user can set
    // e.g., a user can only set "Cancelled"
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

// 4. Delete an order by a regular user (if allowed)
// IMPORTANT: Add authorization here to ensure a user can only delete their OWN order.
router.delete("/:orderId", auth, deleteOrderController);
// Note: Your `deleteOrderController` will need to implement the check `user: req.user._id`

// 5. Get ALL orders (Admin only)
// Consolidated the two `router.get("/", auth, getAllOrdersController);` lines
router.get("/", auth, authorizeRoles('admin'), getAllOrdersController);


// 6. Update order status by Admin
// This route uses `updateOrderStatusController` which should handle any order.
router.put("/:orderId/status/admin", auth, authorizeRoles('admin'), updateOrderStatusController);


export default router;