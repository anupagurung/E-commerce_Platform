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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAllProducts);
router.get("/:id", getProduct);

router.post("/", upload.array('images', 10), addProduct);

router.put("/:id", upload.array('images', 10), modifyProduct);

router.delete("/:id", removeProduct);

export default router;
