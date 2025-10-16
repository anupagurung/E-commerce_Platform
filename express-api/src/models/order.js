const mongoose = require('mongoose');

// --- Sub-schema for items within an order ---
// This defines the structure of each product in the orderItems array.
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    // We store name, price, and image at the time of order
    // to keep a historical record, in case the original product is changed or deleted.
    name: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
    },
    price: { 
        type: Number, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
});


// --- Main Order Schema ---
const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    // An array of items purchased, using the sub-schema defined above
    orderItems: [orderItemSchema],
    
    // A snapshot of the user's shipping address at the time of the order
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    
    // --- Payment Details ---
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required.'],
    },
    // This can store details from the payment gateway (e.g., Stripe, PayPal)
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    
    // --- Price Summary ---
    // These values are calculated at the time of order creation.
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    
    // --- Order Status ---
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    deliveredAt: {
        type: Date,
    },

}, {
    // Automatically adds createdAt (order date) and updatedAt fields
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;