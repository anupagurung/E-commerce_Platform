import stripePackage from 'stripe';
import axios from 'axios';
import Order from '../models/order.js';
import * as paymentService from '../services/paymentService.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const KHALTI_API_URL = 'https://khalti.com/api/v2';

// 1. For Cash on Delivery
export const createCodPaymentController = async (req, res) => {
    try {
        const { payment, order } = await paymentService.createCodPayment(req.body);
        res.status(201).json({
            success: true,
            message: 'COD order placed successfully.',
            data: {
                status: payment.status,
                orderStatus: order.orderStatus,
                paymentProvider: payment.paymentProvider,
                method: payment.method,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. For Stripe Card Payment - Create Payment Intent
export const createStripePaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

        const amountInPaisa = Math.round(order.totalPrice * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa,
            currency: 'npr', // Or 'usd'
            metadata: { orderId: order._id.toString() },
        });

        res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. For Stripe Webhook - To confirm payment securely
export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        
        await paymentService.handleSuccessfulPayment(orderId, {
            provider: 'stripe',
            method: 'card',
            transactionId: paymentIntent.id,
        });
    }

    res.status(200).json({ received: true });
};

// 4. For Khalti - Initiate Payment
export const initiateKhaltiPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

        const payload = {
            return_url: `${process.env.FRONTEND_URL}/payment/success/khalti`,
            website_url: process.env.FRONTEND_URL,
            amount: Math.round(order.totalPrice * 100),
            purchase_order_id: order._id.toString(),
            purchase_order_name: `Order #${order._id.toString().substring(0, 8)}`,
        };

        const headers = { 'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}` };
        const response = await axios.post(`${KHALTI_API_URL}/payment/initiate/`, payload, { headers });

        res.status(200).json({ success: true, paymentUrl: response.data.payment_url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};

// 5. For Khalti - Verify Payment
export const verifyKhaltiPayment = async (req, res) => {
    try {
        const { pidx } = req.body;
        if (!pidx) return res.status(400).json({ success: false, message: 'pIdx is required.' });

        const headers = { 'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}` };
        const response = await axios.post(`${KHALTI_API_URL}/payment/verify/`, { pidx }, { headers });

        if (response.data.status === 'Completed') {
            const orderId = response.data.purchase_order_id;
            await paymentService.handleSuccessfulPayment(orderId, {
                provider: 'khalti',
                method: 'online',
                transactionId: pidx,
            });
            res.status(200).json({ success: true, message: 'Payment verified successfully.' });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};