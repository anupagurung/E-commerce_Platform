import express from 'express';
import {
  registerUser,
  loginUser,
  getMyProfile,         // New controller for /me
  getUserProfileById,     // New controller for /:id
  getAllUsers,
  deleteUserByAdmin,
  updateUserRoleByAdmin
} from '../controllers/userController.js';

import { auth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Authenticated User Routes ---
// Get current logged-in user's profile
router.get('/me', auth, getMyProfile);

// Get a user's profile by ID (accessible by any authenticated user)
router.get('/:id', auth, getUserProfileById);

// --- Admin Only Routes ---
// Get all users
router.get('/', auth, authorizeRoles('admin'), getAllUsers);
// Update a user's role
router.put('/admin/role/:id', auth, authorizeRoles('admin'), updateUserRoleByAdmin);
// Delete a user
router.delete('/admin/user/:id', auth, authorizeRoles('admin'), deleteUserByAdmin);

export default router;