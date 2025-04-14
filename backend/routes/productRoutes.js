import express from "express";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // ✅ Ensure only admins can modify products

const router = express.Router();

// ✅ Public + Admin Combined
router.route("/")
  .get(getProducts)                         // Public
  .post(protect, admin, createProduct);     // Admin only

router.route("/:id")
  .get(getProductById)                      // Public
  .put(protect, admin, updateProduct)       // Admin only
  .delete(protect, admin, deleteProduct);   // Admin only

export default router;
