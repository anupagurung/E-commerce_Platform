const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");  
const {
    createOrder,
    getOrderById,
    getUserOrders
} = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

// Any logged-in user can create an order
router.post('/', auth, createOrder);

// User can view their own orders
router.get('/myorders/:userId', auth, getUserOrders);

// User can view a specific order
router.get('/:id', auth, getOrderById);

// Payment routes (make sure these exist in controller)
router.post('/:id/payment', auth, orderController.orderPayment);
router.put('/:id/payment', auth, orderController.confirmOrderPayment);

module.exports = router;
