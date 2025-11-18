import express from "express";
import multer from "multer"; // <--- REQUIRED for Cloudinary uploads too
import { 
  getAllProducts, 
  getProduct, 
  addProduct, 
  modifyProduct, 
  removeProduct 
} from "../controllers/productController.js";

const router = express.Router();

// <--- Configure Multer to hold file in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAllProducts);
router.get("/:id", getProduct);

// <--- ADD 'upload.array("images")'
// This parses the form so your Controller can see req.body and req.files
router.post("/", upload.array("images"), addProduct);

// <--- ADD 'upload.array("images")' here too
router.put("/:id", upload.array("images"), modifyProduct);

router.delete("/:id", removeProduct);

export default router;