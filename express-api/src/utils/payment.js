import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const payViaKhalti = async (orderId, paymentData) => {
  if (!paymentData) throw new Error("Payment data is required");
  if (!paymentData.amount) throw new Error("Payment amount is required");
  if (!paymentData.purchase_order_id)
    throw new Error("Purchase order ID is required");
  if (!paymentData.purchase_order_name)
    throw new Error("Purchase order name is required");

  const body = {
    return_url: process.env.KHALTI_RETURN_URL,
    website_url: process.env.APP_URL || "http://localhost:3000",
    amount: paymentData.amount,
    purchase_order_name: paymentData.purchase_order_name,
    customer_info: {
      name: paymentData.customer_name,
      email: paymentData.customer_email,
      phone: paymentData.customer_phone,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.KHALTI_API_URL}/v2/payment/initiate/`,
      body,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data, message: "Payment processed" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || "Payment failed",
    };
  }
};

export default payViaKhalti;
