import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @desc Create a new user (Register)
 */
export const createUser = async (userData) => {
  const { firstName, email, password, role } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User with this email already exists.");
  }

  // Hash password securely
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    firstName,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  // Save and return
  return await user.save();
};

/**
 * @desc Authenticate user (Login)
 */
export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  return user;
};

/**
 * @desc Get single user by ID
 */
export const getUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

/**
 * @desc Get all users (admin only)
 */
export const getAllUsers = async () => {
  return await User.find({}).select("-password");
};

/**
 * @desc Delete user by ID (admin only)
 */
export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
