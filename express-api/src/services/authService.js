import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== REGISTER ======================
export async function registerUser({ firstName, lastName, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Password hashing handled by pre-save middleware, so we can just pass it
  const newUser = await User.create({ firstName, lastName, email, password });

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "7d" }
  );

  return {
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
}

// ====================== LOGIN ======================
export async function loginUser({ email, password }) {
  if (!email || !password) throw new Error("Email and password are required");

  // Must select password because of select:false in schema
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "7d" }
  );

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token,
  };
}
