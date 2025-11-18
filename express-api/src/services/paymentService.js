// --- START OF FILE: src/services/paymentService.js ---

import Payment from '../models/Payment.js';

/**
 * Creates a new payment record in the database.
 * @param {object} paymentData - The data for the new payment.
 * @returns {Promise<Document>} The newly created payment document.
 */
export const createPayment = async (paymentData) => {
  // This will create and save the new payment document to the database
  const newPayment = await Payment.create(paymentData);
  return newPayment;
};

// You can add more payment-related database functions here later
// For example:
// export const getPaymentByOrderId = async (orderId) => { ... };