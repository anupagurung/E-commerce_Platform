const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["khalti"], // you can add more providers later
      default: "khalti",
    },
    amount: {
      type: Number,
      required: true,
    },
    method:{
      type: String,
      required:[true, "Please specify payment method" ],
      enum: ["cash", "online" , "card"],
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // each Khalti transaction has a unique ID
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
    createdAt: {
      type: Date,
      default: Date.now,
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
