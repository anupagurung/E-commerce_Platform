// controllers/userController.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
  const options = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
};

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully.',
      data: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get single user profile
 * @route GET /api/users/:id
 * @access Private (authenticated user)
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc Get all users (admin only)
 * @route GET /api/users
 * @access Private (admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc Delete a user by ID (admin only)
 * @route DELETE /api/users/admin/user/:id
 * @access Private (admin)
 */
exports.deleteUserByAdmin = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      message: `User ${user.firstName || 'with ID ' + req.params.id} deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
