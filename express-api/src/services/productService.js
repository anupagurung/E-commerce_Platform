import Product from "../models/Product.js";
import { uploadFiles } from "../utils/file.js";

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

export const getProductById = async (productId) => Product.findById(productId);

export const createProduct = async (productData, files) => {
  let uploadedImageUrls = [];

  if (files && files.length > 0) {
    const uploadResults = await uploadFiles(files, "products");
    uploadedImageUrls = uploadResults.map(r => r.secure_url);
  }

  const mainImageUrl = uploadedImageUrls.length > 0
    ? uploadedImageUrls[0]
    : (productData.imageUrl || 'https://via.placeholder.com/150?text=No+Image');
  const allImages = uploadedImageUrls.length > 0
    ? uploadedImageUrls
    : (productData.images || []);

  const product = new Product({
    ...productData,
    imageUrl: mainImageUrl,
    images: allImages,
  });
  return product.save();
};

export const updateProduct = async (productId, updateData, files) => {
  let uploadedImageUrls = [];

  if (files && files.length > 0) {
    const uploadResults = await uploadFiles(files, "products");
    uploadedImageUrls = uploadResults.map(r => r.secure_url);

    if (uploadedImageUrls.length > 0) {
      updateData.imageUrl = uploadedImageUrls[0];
      updateData.images = uploadedImageUrls;
    }
  }

  return Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteProduct = async (productId) => Product.findByIdAndDelete(productId);
