const productService = require("../services/productService");

/**
 * Get all products (with filtering, searching, sorting, and pagination)
 */
exports.getAllProducts = async (req, res) => {
  try {
    // Extract query params for filtering, searching, sorting
    const { category, minPrice, maxPrice, search, sortBy, page, limit } = req.query;

    const filters = {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };

    const products = await productService.getProducts(filters);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * Get a single product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * Create a new product
 * (Protected: Admin/Seller only)
 */
exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * Update a product by ID
 * (Protected: Admin/Seller only)
 */
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * Delete a product by ID
 * (Protected: Admin/Seller only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
