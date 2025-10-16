const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment'); // Make sure you have a Payment model
const crypto = require('crypto');
const payment = require('../utils/payment'); // Khalti payment module

/**
 * Create a new order
 */
exports.createOrder = async (orderData) => {
  const { user, orderItems, shippingAddress, paymentMethod, taxPrice = 0, shippingPrice = 0 } = orderData;

  if (!orderItems || orderItems.length === 0) {
    throw new Error("No order items provided");
  }

  const itemsFromDB = await Product.find({
    '_id': { $in: orderItems.map(item => item.product) }
  });

  const itemsPrice = orderItems.reduce((acc, item) => {
    const productFromDB = itemsFromDB.find(p => p._id.toString() === item.product);
    if (!productFromDB) throw new Error(`Product with ID ${item.product} not found.`);
    return acc + productFromDB.price * item.quantity;
  }, 0);

  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const processedOrderItems = orderItems.map(item => {
    const productFromDB = itemsFromDB.find(p => p._id.toString() === item.product);
    return {
      product: item.product,
      quantity: item.quantity,
      name: productFromDB.name,
      price: productFromDB.price,
      imageUrl: productFromDB.image,
    };
  });

  const order = new Order({
    user,
    orderItems: processedOrderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  return await order.save();
};

/**
 * Get a single order by its ID
 */
exports.getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('user', 'firstName lastName email');
};

/**
 * Get all orders for a specific user
 */
exports.getOrdersByUserId = async (userId) => {
  return await Order.find({ user: userId }).populate('orderItems.product', 'name price image');
};

/**
 * Update an order by ID
 */
exports.updateOrder = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true });
};

/**
 * Delete an order by ID and create payment record
 */
exports.deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");

  const transactionId = crypto.randomUUID();

  const paymentRecord = await Payment.create({
    amount: order.totalPrice,
    method: "online",
    transactionId,
  });

  await Order.findByIdAndUpdate(id, {
    payment: paymentRecord._id,
    isPaid: true,
    paidAt: Date.now(),
    orderStatus: "Processing",
  });

  return { order, paymentRecord };
};

/**
 * Confirm order payment status
 */
exports.confirmationOrderPayment = async (id, status) => {
  const order = await Order.findById(id).populate('payment');
  if (!order) throw new Error("Order not found");

  if (status === "completed") {
    await Payment.findByIdAndUpdate(order.payment._id, { status: "completed" });
    await Order.findByIdAndUpdate(id, { orderStatus: "completed" });
  } else {
    await Payment.findByIdAndUpdate(order.payment._id, { status: "failed" });
    await Order.findByIdAndUpdate(id, { orderStatus: "Payment failed" });
    status = "Payment failed";
  }

  return { orderId: id, status };
};

/**
 * Process order payment via Khalti
 */
exports.orderPayment = async (orderId, paymentData) => {
  const order = await Order.findById(orderId).populate('user', 'firstName lastName email phone');
  if (!order) throw new Error("Order not found");

  const khaltiPaymentData = {
    amount: order.totalPrice * 100, // amount in paisa
    purchase_order_id: order._id.toString(),
    purchase_order_name: order._id.toString(),
    return_url: paymentData.return_url,
    website_url: paymentData.website_url,
    customer_name: `${order.user.firstName} ${order.user.lastName}`,
    customer_email: order.user.email,
    customer_phone: order.user.phone,
  };

  const paymentResponse = await payment.payViaKhalti(orderId, khaltiPaymentData);
  return paymentResponse;
};
