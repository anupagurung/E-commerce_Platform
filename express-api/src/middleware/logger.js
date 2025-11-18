// src/middleware/logger.js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default logger;  // ✅ ESM default export
