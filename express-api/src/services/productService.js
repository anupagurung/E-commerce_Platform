const { cloudinary } = require("../config/config");
const Product = require("../models/Product");
const { uploadFiles, uploadToCloudinary } = require('../utils/file');
/**
 * Get products with filtering, searching, sorting, and pagination
 */
exports.getProducts = async (queryParams) => {
  const { search, sortBy, category, minPrice, maxPrice, page = 1, limit = 10 } = queryParams;

  let query = {};

  // 1. Filtering by category
  if (category) query.category = category;

  // 2. Searching by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 3. Price range filtering
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 4. Sorting
  let sortOptions = {};
  switch (sortBy) {
    case "price-asc":
      sortOptions.price = 1;
      break;
    case "price-desc":
      sortOptions.price = -1;
      break;
    case "az":
      sortOptions.name = 1;
      break;
    case "za":
      sortOptions.name = -1;
      break;
    default:
      sortOptions.createdAt = -1;
  }

  // 5. Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

/**
 * Get a single product by ID
 */
exports.getProductById = async (productId) => {
  return await Product.findById(productId);
};

/**
 * Create a new product (with optional Cloudinary upload)
 */
exports.createProduct = async (productData, fileBuffer) => {
  try {
    let imageUrl = null;

    // If image buffer provided, upload to Cloudinary
    if (fileBuffer) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer); 
      });

      imageUrl = uploadResult.secure_url;
    }

    const product = new Product({
      ...productData,
      image: imageUrl, // store the uploaded image URL
    });

    return await product.save();
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};

/**
 * Update an existing product by ID
 */
exports.updateProduct = async (productId, updateData) => {
  return await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a product by ID
 */
exports.deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};
exports.updateProduct = async (productId, updateData, files) => {
  try {
    let imageUrls = [];

    //  If new files are uploaded, upload them to Cloudinary
    if (files && files.length > 0) {
      const uploadResults = await uploadFiles(files, "products");
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    // If there are new images, replace the `image` or `images` field
    if (imageUrls.length > 0) {
      // If your Product schema uses `image` for single image:
      // updateData.image = imageUrls[0]; // only the first image
      // If your Product schema uses `images` array:
      updateData.images = imageUrls; // replace with new images
    }

    //  Update the product in DB
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};