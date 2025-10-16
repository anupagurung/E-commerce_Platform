const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { auth, authorize } = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllProducts);       // List all products
router.get("/:id", getProductById);    // Get product by ID


router.post("/", auth, authorize("admin", "seller"), createProduct);
router.put("/:id", auth, authorize("admin", "seller"), updateProduct);
router.delete("/:id", auth, authorize("admin", "seller"), deleteProduct);

module.exports = router;
