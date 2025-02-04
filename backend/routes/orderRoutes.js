import express from "express";
import { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered 
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User Routes
router.route("/").post(protect, createOrder); // Create order
router.route("/myorders").get(protect, getMyOrders); // Get user's orders
router.route("/:id").get(protect, getOrderById); // Get specific order

// ✅ Admin-Only Routes
router.route("/").get(protect, admin, getAllOrders); // Get all orders (Admin)
router.route("/:id/pay").put(protect, admin, updateOrderToPaid); // ✅ Only admins can update payment status
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // Mark as delivered

export default router;
