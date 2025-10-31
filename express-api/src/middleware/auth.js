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

    // ✅ Use same fallback secret as authService
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};
