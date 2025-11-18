// --- START OF FILE order.js ---

import mongoose from "mongoose";
import './Payment.js';
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      imageUrl: { type: String },
    }
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  // REMOVED: paymentMethod is now handled by the separate Payment model
  // paymentMethod: { type: String, required: true },

  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  // NEW: Add payment status fields to the Order
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  // NEW: Add a reference to Payment documents
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment", // Ensure this matches the model name you exported (e.g., "Payment")
    },
  ],

  //order status
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
