import express from "express";
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  getMyQuotes,
} from "../controllers/quoteController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new quote (client)
router.route("/").post(protect, createQuote);

// ✅ Get current user's own quotes (client)
router.get("/my", protect, getMyQuotes); // 👈 this MUST come before "/:id"

// ✅ Get all quotes (admin only)
router.route("/admin").get(protect, admin, getQuotes);

// ✅ Get / update / delete a specific quote
router
  .route("/:id")
  .get(protect, getQuoteById)
  .put(protect, admin, updateQuote)
  .delete(protect, admin, deleteQuote);

export default router;
