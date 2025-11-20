import Payment from "../models/payment.js";
import Order from "../models/order.js";
import { addPaymentToOrder, updateOrderAsPaid } from "./orderService.js";

/**
 * Creates a payment record for Cash on Delivery.
 * Status is 'pending'.
 */
export const createCodPayment = async (paymentData) => {
    const { orderId } = paymentData;
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found.");

    const newPayment = await Payment.create({
        order: orderId,
        user: order.user,
        amount: order.totalPrice,
        method: 'cash',
        paymentProvider: 'cod',
        transactionId: `COD-${Date.now()}`,
        status: 'pending',
    });

    await addPaymentToOrder(orderId, newPayment._id);

    // For COD, the order status might remain 'Pending' or move to 'Processing'
    // depending on your business logic. Let's assume it stays 'Pending' until delivery.
    const finalOrderState = await Order.findById(orderId);

    return {
        payment: newPayment,
        order: finalOrderState,
    };
};

/**
 * Handles a confirmed online payment from Stripe or Khalti.
 * Creates a 'completed' payment record and updates the order.
 */
export const handleSuccessfulPayment = async (orderId, paymentDetails) => {
    const { provider, method, transactionId } = paymentDetails;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error(`Order not found with ID: ${orderId} during payment fulfillment.`);
    }

    // Idempotency check: If the order is already paid, do nothing.
    if (order.isPaid) {
        console.log(`Order ${orderId} has already been paid. Skipping update.`);
        return order;
    }

    // 1. Create a "completed" payment record
    const newPayment = await Payment.create({
        order: orderId,
        user: order.user,
        amount: order.totalPrice,
        paymentProvider: provider,
        method: method,
        transactionId: transactionId,
        status: 'completed',
    });

    // 2. Link the payment to the order
    await addPaymentToOrder(orderId, newPayment._id);

    // 3. Mark the order as paid (sets isPaid, paidAt, and status to 'Processing')
    const updatedOrder = await updateOrderAsPaid(orderId);

    console.log(`Successfully processed ${provider} payment for order ${orderId}`);
    return updatedOrder;
};