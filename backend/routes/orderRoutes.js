import express from "express";
import { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus, // ✅ Import new controller
    toggleOrderPaymentStatus 
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User Routes
router.route("/").post(protect, createOrder); // Create order
router.route("/myorders").get(protect, getMyOrders); // Get user's orders
router.route("/:id").get(protect, getOrderById); // Get specific order

// ✅ Admin-Only Routes
router.route("/").get(protect, admin, getAllOrders); // Get all orders (Admin)
router.route("/:id/toggle-pay").put(protect, admin, toggleOrderPaymentStatus); // ✅ Toggle payment status
router.route("/:id/status").put(protect, admin, updateOrderStatus); // ✅ New route for updating order status

export default router;
