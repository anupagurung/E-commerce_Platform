import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "../controllers/orderController.js";
import Order from "../models/order.js";

const router = express.Router();

router.post("/", auth, createOrderController);
router.get("/orders", auth, getUserOrdersController);
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
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

router.delete("/:orderId", auth, deleteOrderController);

router.get("/", auth, getAllOrdersController);
router.put("/:orderId/status/admin", auth, updateOrderStatusController);

export default router;
