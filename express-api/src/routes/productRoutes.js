import express from "express";
import { 
  getAllProducts, 
  getProduct, 
  addProduct, 
  modifyProduct, 
  removeProduct 
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", addProduct);
router.put("/:id", modifyProduct);
router.delete("/:id", removeProduct);

export default router;
