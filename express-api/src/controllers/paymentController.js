// --- START OF FILE: src/controllers/paymentController.js ---

import * as paymentService from '../services/paymentService.js';
import * as orderService from '../services/orderService.js';

/**
 * Controller to handle the creation of a new payment.
 * The 'export' keyword below is the fix for your error.
 */
export const createPaymentController = async (req, res) => {
  try {
    // 1. Get required data from the request body and authenticated user
    const { orderId, method, transactionId, status } = req.body;
    const userId = req.user._id;

    // 2. Validate that the order exists and belongs to the user
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized: You cannot pay for someone else's order."})
    }
    if (order.isPaid) {
      return res.status(400).json({ success: false, message: "This order has already been paid."})
    }

    // 3. Prepare the data for the new payment record
    const paymentData = {
      user: userId,
      order: orderId,
      amount: order.totalPrice, // Get the amount from the trusted order object
      method: method, // "cash" or "online"
      transactionId: transactionId, // e.g., "COD-12345" or a real Khalti ID
      status: status, // "pending" for cash, "completed" for Khalti
      shippingAddress: order.shippingAddress, // Copy shipping address from order
    };

    // 4. Call the service to create the payment in the database
    const payment = await paymentService.createPayment(paymentData);

    // 5. Link this new payment back to the original order
    await orderService.addPaymentToOrder(orderId, payment._id);

    // 6. If the payment was successful ('completed'), update the order status
    if (payment.status === 'completed') {
      await orderService.updateOrderAsPaid(orderId);
    }

    // 7. Send a success response
    res.status(201).json({ success: true, message: 'Payment processed successfully', data: payment });

  } catch (error) {
    console.error("Error in createPaymentController:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};