// src/routes/orderRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", auth, createOrderController);
router.get("/myorders", auth, getUserOrdersController);
router.get("/", auth, getAllOrdersController); // Admin only, handle role in middleware later

export default router;
