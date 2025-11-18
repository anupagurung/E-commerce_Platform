import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../services/productService.js";

/**
 * Get all products
 */
export const getAllProducts = async (req, res) => {
  try {
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

    const productsData = await getProducts(filters);

    res.status(200).json({
      success: true,
      count: productsData.products.length,
      data: productsData,
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
 * Get single product
 */
export const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch product", error: error.message });
  }
};

/**
 * Create product
 */
export const addProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body, req.files);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create product", error: error.message });
  }
};

/**
 * Update product
 */
export const modifyProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body, req.files);

    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update product", error: error.message });
  }
};

/**
 * Delete product
 */
export const removeProduct = async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);

    if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};
