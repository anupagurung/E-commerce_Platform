import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js"; 
import payment from "../utils/payment.js"; 

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const { user, orderItems, shippingAddress, paymentMethod, taxPrice = 0, shippingPrice = 0 } = orderData;

  if (!orderItems || orderItems.length === 0) throw new Error("No order items provided");

  const itemsFromDB = await Product.find({
    "_id": { $in: orderItems.map(item => item.product) },
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
export const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate("user", "firstName lastName email");
};

/**
 * Get all orders for a specific user
 */
export const getOrdersByUserId = async (userId) => {
  return await Order.find({ user: userId }).populate("orderItems.product", "name price image");
};

/**
 * Confirm order payment status
 */
export const confirmOrderPayment = async (id, status) => {
  const order = await Order.findById(id).populate("payment");
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
export const orderPayment = async (orderId, paymentData) => {
  const order = await Order.findById(orderId).populate("user", "firstName lastName email phone");
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
