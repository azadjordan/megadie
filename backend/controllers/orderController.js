// ✅ orderController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Quote from "../models/quoteModel.js";

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  await order.deleteOne();
  res.status(204).end(); // No Content
});


// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (User or Admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name code size");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only the user who placed the order or an admin can access
  if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
    res.json(order);
  } else {
    res.status(401);
    throw new Error("Not authorized to view this order");
  }
});

// @desc    Get orders of logged-in user
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  });
  

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Create order from a quote
// @route   POST /api/orders/from-quote/:quoteId
// @access  Private/Admin
const createOrderFromQuote = asyncHandler(async (req, res) => {
  const { quoteId } = req.params;

  const quote = await Quote.findById(quoteId).populate("requestedItems.product");

  if (!quote) {
    res.status(404);
    throw new Error("Quote not found.");
  }

  if (quote.isOrderCreated) {
    res.status(400);
    throw new Error("Order has already been created from this quote.");
  }

  const order = new Order({
    user: quote.user,
    orderItems: quote.requestedItems.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      unitPrice: item.unitPrice,
    })),
    shippingAddress: "No address provided for this order!",
    totalPrice: quote.totalPrice,
    deliveryCharge: quote.deliveryCharge,
    extraFee: quote.extraFee,
    clientToAdminNote: quote.clientToAdminNote,
    adminToAdminNote: quote.adminToAdminNote,
    adminToClientNote: quote.AdminToClientNote,
  });

  const createdOrder = await order.save();

  quote.isOrderCreated = true;
  quote.createdOrderId = createdOrder._id;
  await quote.save();

  res.status(201).json(createdOrder);
});

export { getOrders, createOrderFromQuote, getMyOrders, getOrderById, deleteOrder };
