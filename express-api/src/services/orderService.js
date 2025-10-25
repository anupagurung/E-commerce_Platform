import Order from "../models/order.js";

// CREATE NEW ORDER
export const createOrderService = async (userId, orderData) => {
  const newOrder = await Order.create({
    user: userId,
    ...orderData,
  });
  return newOrder;
};

// GET ORDERS OF A SINGLE USER
export const getUserOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId }).populate(
    "user",
    "firstName lastName email"
  );
  return orders;
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersService = async () => {
  const orders = await Order.find().populate("user", "firstName lastName email");
  return orders;
};
