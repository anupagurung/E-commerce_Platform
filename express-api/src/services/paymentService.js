
import Payment from '../models/payment.js';

/**
 * Creates a new payment record in the database.
 * @param {object} paymentData - The data for the new payment.
 * @returns {Promise<Document>} The newly created payment document.
 */
export const createPayment = async (paymentData) => {
  const newPayment = await Payment.create(paymentData);
  return newPayment;
};

