// services/userService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @desc Create a new user (Register)
 * @param {object} userData - Data for the new user from req.body
 * @returns {Promise<Object>} - The newly created user document
 */
exports.createUser = async (userData) => {
  const { firstName, email, password, role } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User with this email already exists.');
  }

  // Hash password securely
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    firstName,
    email,
    password: hashedPassword,
    role: role || 'user', // Default role = user
  });

  // Save and return
  return await user.save();
};

/**
 * @desc Authenticate user (Login)
 * @param {string} email - User email
 * @param {string} password - Plain-text password
 * @returns {Promise<Object>} - The authenticated user document
 */
exports.authenticateUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  return user;
};

/**
 * @desc Get single user by ID
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object|null>}
 */
exports.getUserById = async (userId) => {
  return await User.findById(userId).select('-password');
};

/**
 * @desc Get all users (admin only)
 * @returns {Promise<Array>}
 */
exports.getAllUsers = async () => {
  return await User.find({}).select('-password');
};

/**
 * @desc Delete user by ID (admin only)
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object|null>}
 */
exports.deleteUs
