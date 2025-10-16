// services/authService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "7d";

// --- Register a new user ---
const registerUser = async ({ firstName, lastName, email, password }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered.");

  // Create new user (password will be hashed automatically in pre-save hook)
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  // Generate JWT
  const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // Remove password before returning
  const userObj = newUser.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

// --- Login existing user ---
const loginUser = async ({ email, password }) => {
  // Select password explicitly
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password.");

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password.");

  // Generate JWT
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // Remove password before returning
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

module.exports = {
  registerUser,
  loginUser,
};
