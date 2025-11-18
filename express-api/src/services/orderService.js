// --- START OF FILE orderService.js ---

import Order from "../models/order.js";
// You might also need to import your Payment model if you plan to directly create/update it here,
// but for populating, just the ref name is enough.
// import Payment from "../models/payment.js"; // Only if you manipulate Payment directly here

// CREATE ORDER
export const createOrder = async (userId, orderData) => {
  // IMPORTANT: 'orderData' should no longer contain 'paymentMethod'
  const newOrder = await Order.create({
    user: userId,
    // Ensure orderData does NOT include paymentMethod here
    ...orderData,
    orderStatus: "Pending",
    isPaid: false, // Default to false when order is created
  });
  return newOrder;
};

// GET USER ORDERS
export const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("user", "firstName lastName email")
    .populate({
      path: 'payments', // This corresponds to the 'payments' array in your Order schema
      select: 'paymentProvider amount method status transactionId paymentDate' // Select specific fields you need from the Payment document
    });
  return orders;
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .populate({
      path: 'payments', // This corresponds to the 'payments' array in your Order schema
      select: 'paymentProvider amount method status transactionId paymentDate' // Select specific fields you need from the Payment document
    });
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

// GET ORDER BY ID (used for delete & validation)
export const getOrderById = async (orderId) => {
  // If you need payment info when getting by ID, populate it here too
  const order = await Order.findById(orderId)
    .populate({
      path: 'payments',
      select: 'paymentProvider amount method status transactionId paymentDate'
    });
  return order;
};

// DELETE ORDER
export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  // Consider also deleting associated payments if an order is deleted
  // await Payment.deleteMany({ order: orderId }); // Requires importing Payment model
  await order.deleteOne();
  return order;
};
