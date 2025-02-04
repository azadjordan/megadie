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

// ✅ Public Routes (Anyone can access)
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// ✅ Admin-Only Routes (Protected)
router.route("/").post(protect, admin, createProduct);
router.route("/:id").put(protect, admin, updateProduct);
router.route("/:id").delete(protect, admin, deleteProduct);

export default router;
