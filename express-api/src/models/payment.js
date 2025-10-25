import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order", // ✅ matches your Order model name
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["khalti", "stripe", "paypal"],
      default: "khalti",
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: [true, "Please specify payment method"],
      enum: ["cash", "online", "card"],
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // ensures every payment has a unique reference
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String, required: true },
      province: { type: String, required: true },
      country: { type: String, default: "Nepal" },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
