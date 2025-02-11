import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Logged-in users only)
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, totalPrice, note } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress: req.user.address,
        totalPrice,
        note, // ✅ Save note in database
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});


// @desc    Get order by ID (Owner/Admin)
// @route   GET /api/orders/:id
// @access  Private (Only the order owner or an admin)
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // ✅ Only the order owner OR an admin can access the order
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order);
    } else {
        res.status(403); // ❌ Forbidden for unauthorized users
        throw new Error("Not authorized to view this order");
    }
});


// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // ✅ Sort by newest first
    res.json(orders);
});


// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
});

// @desc    Toggle order payment status (Admin only)
// @route   PUT /api/orders/:id/toggle-pay
// @access  Private/Admin
const toggleOrderPaymentStatus = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update payment status");
    }

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = !order.isPaid; // Toggle payment status
        order.paidAt = order.isPaid ? Date.now() : null; // Set or clear payment date

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update order status");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    order.status = req.body.status || order.status; // Update status if provided

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

export { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    toggleOrderPaymentStatus,
    updateOrderStatus 
};
