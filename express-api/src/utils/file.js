const cloudinary = require('../config/cloudinary');

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file objects (from multer)
 * @returns {Promise<Array>} Array of upload results
 */
async function uploadFiles(files) {
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
 * Upload a single file buffer to Cloudinary (helper)
 * @param {Buffer} buffer
 * @param {String} folder
 * @returns {Promise<Object>}
 */
async function uploadToCloudinary(buffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

//Export both functions properly
module.exports = { uploadFiles, uploadToCloudinary };
