import express from "express";
import { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus, 
    toggleOrderPaymentStatus,
    deductStock, // ✅ Import new controllers
    restoreStock,
    toggleOrderDebt,
    updateAdminNote,
    updateSellerNote,
    updateOrderPrices,
    toggleDebtAssignment
    
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User Routes
router.route("/").post(protect, createOrder); 
router.route("/myorders").get(protect, getMyOrders); 
router.route("/:id").get(protect, getOrderById); 

// ✅ Admin-Only Routes
router.route("/").get(protect, admin, getAllOrders);
router.route("/:id/seller-note").put(protect, admin, updateSellerNote);
router.put("/:id/update-prices", protect, admin, updateOrderPrices);
router.route("/:id/admin-note").put(protect, admin, updateAdminNote);
router.route("/:id/toggle-pay").put(protect, admin, toggleOrderPaymentStatus);
router.route("/:id/status").put(protect, admin, updateOrderStatus);
router.route("/:id/deduct-stock").post(protect, admin, deductStock); // ✅ New
router.route("/:id/restore-stock").post(protect, admin, restoreStock); // ✅ New
router.route("/:id/toggle-debt").put(protect, admin, toggleDebtAssignment);

export default router;
