import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUserByAdmin,
} from "../controllers/userController.js";

import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Any logged-in user can view their own profile
router.get("/:id", auth, getUserProfile);

// Only admin can view all users
router.get("/", auth, authorize("admin"), getAllUsers);

// Only admin can delete a user
router.delete("/admin/user/:id", auth, authorize("admin"), deleteUserByAdmin);

export default router;
