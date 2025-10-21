import Product from "../models/Product.js";
import { uploadFiles } from "../utils/file.js";

/**
 * Get products with filtering, search, sort, pagination
 */
export const getProducts = async (queryParams) => {
  const { search, sortBy, category, minPrice, maxPrice, page = 1, limit = 10 } = queryParams;

  const query = {};

  if (category) query.category = category;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortOptions = {};
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
 * Get product by ID
 */
export const getProductById = async (productId) => Product.findById(productId);

/**
 * Create a product
 */
export const createProduct = async (productData, files) => {
  let imageUrls = [];

  if (files && files.length > 0) {
    const uploadResults = await uploadFiles(files, "products");
    imageUrls = uploadResults.map(r => r.secure_url);
  }

  const product = new Product({ ...productData, images: imageUrls });
  return product.save();
};

/**
 * Update a product
 */
export const updateProduct = async (productId, updateData, files) => {
  let imageUrls = [];

  if (files && files.length > 0) {
    const uploadResults = await uploadFiles(files, "products");
    imageUrls = uploadResults.map(r => r.secure_url);
  }

  if (imageUrls.length > 0) updateData.images = imageUrls;

  return Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId) => Product.findByIdAndDelete(productId);
