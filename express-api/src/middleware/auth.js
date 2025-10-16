import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (authentication)
const auth = async (req, res, next) => {
  let token;

  //  Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  //  Check cookie if header not found
  else if (req.headers.cookie) {
    // Assuming cookie format: token=XYZ
    const cookieToken = req.headers.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="));
    if (cookieToken) token = cookieToken.split("=")[1];
  }

  // No token found
  if (!token) {
    return res.status(401).json({ message: "Not authenticated: no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authenticated: user not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//  Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

export { auth, authorize };
