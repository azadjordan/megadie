import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Logged-in users only)
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        totalPrice,
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
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
});

// @desc    Update order to paid (Admin only)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403); // ✅ Return "Forbidden" if user is not an admin
        throw new Error("Not authorized to update payment status");
    }

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});


// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = "Delivered";

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

export { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered 
};
