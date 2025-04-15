import express from "express";
import {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} from "../controllers/quoteController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public route (user requests a quote)
router.route("/").post(protect, createQuote);

// ✅ Admin route to get all quotes
router.route("/admin").get(protect, admin, getQuotes);

// ✅ Quote details, update, delete
router
  .route("/:id")
  .get(protect, getQuoteById)
  .put(protect, admin, updateQuote)
  .delete(protect, admin, deleteQuote);

export default router;
