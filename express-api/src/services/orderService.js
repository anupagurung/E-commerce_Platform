import Order from "../models/order.js";

// CREATE ORDER
export const createOrder = async (userId, orderData) => {
  const newOrder = await Order.create({
    user: userId,
    ...orderData,
    orderStatus: "Pending", // default status
  });
  return newOrder;
};

// GET USER ORDERS
export const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("user", "firstName lastName email");
  return orders;
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email");
  return orders;
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  order.orderStatus = status;
  await order.save();
  return order;
};
// DELETE ORDER
export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  await order.deleteOne();
  return order;
};