import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin: 
router.route("/").get(protect, admin, getAllPayments); // Get All Payments
router.route("/").post(protect, admin, createPayment); // Create Payment
router.route("/:id").put(protect, admin, updatePayment); // Update Payment
router.route("/:id").get(protect, admin, getPaymentById); // Get Single Payment
router.route("/:id").delete(protect, admin, deletePayment); // ✅ Delete a Payment


// ✅ User: 
router.route("/user/:userId").get(protect, getUserPayments); // Get Payments for Specific User

export default router;
