import express from "express";
import multer from "multer";
import { 
  getAllProducts,
  getProduct,
  addProduct,
  modifyProduct,
  removeProduct
} from "../controllers/productController.js";

const router = express.Router();

// Multer memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Single image upload for creating product
router.post("/", upload.single("image"), addProduct);

// Multiple images upload for updating product
router.put("/:id", upload.array("images", 5), modifyProduct);

router.delete("/:id", removeProduct);

export default router;
