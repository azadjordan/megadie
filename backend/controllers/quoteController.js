import asyncHandler from "../middleware/asyncHandler.js";
import Quote from "../models/quoteModel.js";

// @desc    Get logged-in user's own quotes
// @route   GET /api/quotes/my
// @access  Private
export const getMyQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({ user: req.user._id })
    .populate("requestedItems.product", "name code size")
    .sort({ createdAt: -1 });

  const sanitizedQuotes = quotes.map((quote) => {
    const quoteObj = quote.toObject();

    if (quote.status === "Requested") {
      // Remove pricing info
      quoteObj.requestedItems = quoteObj.requestedItems.map((item) => ({
        product: item.product,
        qty: item.qty,
      }));

      quoteObj.deliveryCharge = undefined;
      quoteObj.extraFee = undefined;
      quoteObj.totalPrice = undefined;
    }

    return quoteObj;
  });

  res.json(sanitizedQuotes);
});



// @desc    Create a new quote (Client)
// @route   POST /api/quotes
// @access  Private
export const createQuote = asyncHandler(async (req, res) => {
  const { requestedItems, clientToAdminNote } = req.body;

  if (!requestedItems || requestedItems.length === 0) {
    res.status(400);
    throw new Error("No items in the quote.");
  }

  const quote = await Quote.create({
    user: req.user._id,
    requestedItems,
    clientToAdminNote,
    totalPrice: 0,
  });

  res.status(201).json(quote);
});

// @desc    Get all quotes (Admin only) sorted from latest to oldest
// @route   GET /api/quotes/admin
// @access  Private/Admin
export const getQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({})
    .populate("user", "name email")
    .populate("requestedItems.product", "name code size")
    .sort({ createdAt: -1 }); // 👈 Sort by creation date, newest first

  res.json(quotes);
});


// @desc    Get single quote by ID
// @route   GET /api/quotes/:id
// @access  Private/Admin or Owner
export const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id)
    .populate("user", "name email")
    .populate("requestedItems.product", "name code size");

  if (quote) {
    // ✅ Allow user to access their own quote
    if (req.user.isAdmin || req.user._id.equals(quote.user._id)) {
      res.json(quote);
    } else {
      res.status(403);
      throw new Error("Not authorized to view this quote.");
    }
  } else {
    res.status(404);
    throw new Error("Quote not found.");
  }
});

// @desc    Update quote (Admin)
// @route   PUT /api/quotes/:id
// @access  Private/Admin
export const updateQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    res.status(404);
    throw new Error("Quote not found.");
  }

  // ✅ Apply updates from request body
  Object.assign(quote, req.body);

  // ✅ Ensure status is set to "Quoted"
  quote.status = "Quoted";

  const updated = await quote.save();
  res.json(updated);
});


// @desc    Delete quote (Admin)
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    res.status(404);
    throw new Error("Quote not found.");
  }

  await quote.deleteOne();
  res.status(204).end();
});
