import {
  createOrderService,
  getUserOrdersService,
  getAllOrdersService,
} from "../services/orderService.js";

// CREATE ORDER
export const createOrderController = async (req, res) => {
  try {
    const order = await createOrderService(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ORDERS OF LOGGED IN USER
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await getUserOrdersService(req.user._id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
