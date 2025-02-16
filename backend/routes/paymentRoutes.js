import express from "express";
import {
  createPayment,
  getAllPayments,
  getUserPayments,
  updatePayment,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin: 
router.route("/").get(protect, admin, getAllPayments); // Get All Payments
router.route("/").post(protect, admin, createPayment); // Create Payment
router.route("/:id").put(protect, admin, updatePayment); // Create Payment

// ✅ User: 
router.route("/user/:userId").get(protect, getUserPayments); // Get Payments for Specific User

export default router;
