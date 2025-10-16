// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUserByAdmin,
} = require('../controllers/userController');

const { auth, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Any logged-in user can view their own profile
router.get('/:id', auth, getUserProfile);

// Only admin can view all users
router.get('/', auth, authorize('admin'), getAllUsers);

// Only admin can delete a user
router.delete('/admin/user/:id', auth, authorize('admin'), deleteUserByAdmin);

module.exports = router;
