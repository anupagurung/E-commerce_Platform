// express-api/src/utils/file.js
import { cloudinary } from "../config/config.js";

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadFiles(files) {
  const uploadResults = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    uploadResults.push(result);
  }

  return uploadResults;
}

/**
 * Upload a single file buffer to Cloudinary
 */
export async function uploadToCloudinary(buffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}
