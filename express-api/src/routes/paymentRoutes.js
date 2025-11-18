// --- START OF FILE: src/routes/paymentRoutes.js ---

import express from 'express';
import { auth } from '../middleware/auth.js';
import { createPaymentController } from '../controllers/paymentController.js';

const router = express.Router();

// Define the route for creating a new payment
// Method: POST
// Endpoint: /api/payments
// Protected: Yes (requires authentication)
router.post('/', auth, createPaymentController);

export default router;