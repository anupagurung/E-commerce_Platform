const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    salePercentage: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { 
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;