const orderService = require('../services/orderService');

/**
 * @desc   Create a new order
 * @route  POST /api/orders
 * @access Private (User)
 */
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        if (!orderData.orderItems || orderData.orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items found.' });
        }

        const createdOrder = await orderService.createOrder(orderData);
        res.status(201).json({ success: true, data: createdOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc   Get single order by ID
 * @route  GET /api/orders/:id
 * @access Private
 */
exports.getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc   Get all orders of a user
 * @route  GET /api/orders/myorders/:userId
 * @access Private
 */
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUserId(req.params.userId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc   Initiate payment for an order
 * @route  POST /api/orders/:id/payment
 * @access Private
 */
exports.orderPayment = async (req, res) => {
    try {
        const orderId = req.params.id;
        const paymentDetails = req.body;

        // Placeholder logic for payment (integrate Stripe/PayPal here)
        const paymentResult = await orderService.initiateOrderPayment(orderId, paymentDetails);

        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully.',
            data: paymentResult,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Payment initiation failed.',
        });
    }
};

/**
 * @desc   Confirm payment for an order
 * @route  PUT /api/orders/:id/payment
 * @access Private
 */
exports.confirmOrderPayment = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const updatedOrder = await orderService.confirmOrderPayment(orderId, status);

        res.status(200).json({
            success: true,
            message: 'Order payment confirmed.',
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Payment confirmation failed.',
        });
    }
};
