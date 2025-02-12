import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


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

    const { status } = req.body;

    if (status) {
        order.status = status;

        if (status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = new Date(); // Set delivered timestamp
        } else {
            order.isDelivered = false;
            order.deliveredAt = null; // Reset delivered timestamp
        }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

// @desc    Deduct stock for an order
// @route   POST /api/orders/:id/deduct-stock
// @access  Private/Admin
const deductStock = asyncHandler(async (req, res) => {
    console.log("🟢 Received request to deduct stock for order:", req.params.id);

    if (!req.user.isAdmin) {
        console.log("🔴 Not authorized");
        res.status(403);
        throw new Error("Not authorized to update stock");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        console.log("🔴 Order not found");
        res.status(404);
        throw new Error("Order not found");
    }

    if (order.stockUpdated) {
        console.log("🔴 Stock already deducted for this order");
        res.status(400);
        throw new Error("Stock has already been deducted for this order");
    }

    try {
        console.log("🟢 Deducting stock...");
        for (const item of order.orderItems) {
            console.log(`🔹 Checking product ID: ${item.product}`);

            // 🔍 Log the product lookup
            const product = await Product.findById(item.product);
            console.log("🔍 Product Query Result:", product);

            if (!product) {
                console.log(`🔴 Product not found in DB for ID: ${item.product}`);
                throw new Error(`Product not found: ${item.name}`);
            }

            if (product.stock < item.qty) {
                console.log(`🔴 Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`);
                throw new Error(`Not enough stock for ${product.name}.`);
            }

            product.stock -= item.qty;
            await product.save();
            console.log(`✅ Stock updated for ${product.name}, New stock: ${product.stock}`);
        }

        order.stockUpdated = true;
        await order.save();
        console.log("✅ Stock deducted successfully!");

        res.json({ message: "Stock deducted successfully", order });
    } catch (error) {
        console.error("Stock deduction error:", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});


// @desc    Restore stock for an order
// @route   POST /api/orders/:id/restore-stock
// @access  Private/Admin
const restoreStock = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update stock");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (!order.stockUpdated) {
        res.status(400);
        throw new Error("Stock has not been deducted for this order");
    }

    // Restore stock for each product in the order
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.qty;
            await product.save();
        }
    }

    // Reset stockUpdated flag
    order.stockUpdated = false;
    await order.save();

    res.json({ message: "Stock restored successfully", order });
});

export { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    getAllOrders, 
    toggleOrderPaymentStatus,
    updateOrderStatus,
    deductStock, // ✅ New
    restoreStock // ✅ New
};
