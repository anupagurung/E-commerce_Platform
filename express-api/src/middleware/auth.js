import jwt from "jsonwebtoken";
// Note: Assuming your User model is exported as default from User.js
import User from "../models/User.js"; 

/**
 * Middleware for authenticating user via JWT (Bearer header or cookie).
 * If successful, attaches the user object to req.user.
 */
export const auth = async (req, res, next) => {
  try {
    let token;
    
    // 1. Check Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // 2. Check cookie (fallback)
    else if (req.headers.cookie) {
      const cookieToken = req.headers.cookie
        .split(";")
        .find((c) => c.trim().startsWith("token="));
      if (cookieToken) token = cookieToken.split("=")[1];
    }

    if (!token) {
      // If the token is null, it might be due to a malformed header/cookie, or no token present.
      // The `jwt malformed` error often comes from trying to verify an empty/null token.
      return res.status(401).json({ success: false, message: "No authentication token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token payload
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User associated with token not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    // Log the error in the console for debugging
    console.error("Auth middleware error:", err.message); 
    // Send a generic 401 response for security
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Middleware for role-based authorization.
 * Checks if the authenticated user's role is included in the allowed roles array.
 * @param {string[]} roles - An array of roles that are allowed to access the route (e.g., ["admin", "seller"]).
 */
export const authorize = (roles) => (req, res, next) => {
  // Assuming req.user is set by the preceding 'auth' middleware
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: Access is denied" });
  }
  
  // If the user has the correct role, proceed to the next middleware/controller
  next();
};
