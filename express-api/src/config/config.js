import dotenv from "dotenv";
import { v2 as cloudinaryInstance } from "cloudinary";

dotenv.config();

cloudinaryInstance.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinary = cloudinaryInstance;

const config = {
  appUrl: process.env.APP_URL || "http://localhost:3000",
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  khalti: {
    api_key: process.env.KHALTI_API_KEY,
    api_url: process.env.KHALTI_API_URL,
    return_url: process.env.KHALTI_RETURN_URL,
  },
};

export default config; // ✅ add default export
