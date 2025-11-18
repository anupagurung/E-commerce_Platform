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

/**
 * Adds a reference to a new payment to the order's 'payments' array.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} paymentId - The ID of the new payment to link.
 * @returns {Promise<Document>} The updated order document.
 */
export const addPaymentToOrder = async (orderId, paymentId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found while trying to link payment");
  }

  // Add the payment's ID to the order's list of payments
  order.payments.push(paymentId);
  await order.save();
  return order;
};

/**
 * Updates an order to mark it as paid.
 * @param {string} orderId - The ID of the order to update.
 * @returns {Promise<Document>} The updated order document.
 */
export const updateOrderAsPaid = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found while trying to mark as paid");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = "Processing"; // Automatically move to the next status
  await order.save();
  return order;
};