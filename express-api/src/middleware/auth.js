// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config(); 

export const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No authentication token provided" });
    }

    token = token.split(" ")[1];

    // Verify token using the JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach to req.user, excluding password
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
        // Token was valid but user associated with ID no longer exists
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    // Log detailed error for debugging
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ success: false, message: "Token is not valid or expired" });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: "Access denied: User not authenticated or role not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied: Role (${req.user.role}) is not authorized to access this resource` });
    }
    next();
  };
};