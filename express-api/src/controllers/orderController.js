import * as orderService from "../services/orderService.js";

// CREATE ORDER
export const createOrderController = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER ORDERS
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE ORDER
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleted = await orderService.deleteOrder(orderId);
    res.status(200).json({ success: true, message: "Order deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};