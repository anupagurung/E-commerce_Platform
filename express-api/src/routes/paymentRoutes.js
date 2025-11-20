import express from "express";
import { auth } from "../middleware/auth.js";
import {
    createCodPaymentController,
    createStripePaymentIntent,
    stripeWebhookHandler,
    initiateKhaltiPayment,
    verifyKhaltiPayment
} from "../controllers/paymentController.js";

const router = express.Router();

// Route for Cash on Delivery
router.post("/cod", auth, createCodPaymentController);

// Routes for Stripe (Card)
router.post("/create-stripe-intent", auth, createStripePaymentIntent);
// Webhook does not need auth and has a special setup in server.js
router.post("/stripe-webhook", stripeWebhookHandler);

// Routes for Khalti
router.post("/initiate-khalti", auth, initiateKhaltiPayment);
router.post("/verify-khalti", auth, verifyKhaltiPayment);

export default router;