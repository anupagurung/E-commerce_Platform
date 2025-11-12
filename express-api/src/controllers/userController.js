// src/controllers/userController.js
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables here too

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  // Using JWT_SECRET directly from environment
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "7d" }; // Token valid for 7 days
  return jwt.sign(payload, secret, options);
};

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Register User Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get authenticated user's own profile
 * @route GET /api/users/me
 * @access Private (authenticated user)
 */
export const getMyProfile = async (req, res) => {
  try {
    // req.user is populated by the 'auth' middleware
    const user = await userService.getUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found (via token)." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching 'me' profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Get single user profile by ID
 * @route GET /api/users/:id
 * @access Private (authenticated user)
 */
export const getUserProfileById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user by ID profile:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/**
 * @desc Get all users (admin only)
 * @route GET /api/users
 * @access Private (admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc Delete a user by ID (admin only)
 * @route DELETE /api/users/admin/user/:id
 * @access Private (admin)
 */
export const deleteUserByAdmin = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id.toString()) {
      return res.status(400).json({ success: false, message: "Admin cannot delete their own account via this endpoint." });
    }

    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: `User ${user.firstName || "with ID " + req.params.id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update a user's role by ID (admin only)
 * @route PUT /api/users/admin/role/:id
 * @access Private (admin)
 */
export const updateUserRoleByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Optional: Prevent an admin from changing their own role via this endpoint (or demoting another admin easily)
    if (req.user._id.toString() === id.toString()) {
      return res.status(400).json({ success: false, message: "Admin cannot change their own role via this endpoint." });
    }

    const updatedUser = await userService.updateUserRole(id, role);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User ${updatedUser.firstName}'s role updated to ${updatedUser.role}.`,
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};