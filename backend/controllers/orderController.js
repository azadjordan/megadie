import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @desc    Toggle Debt Assignment to User (Admin Only)
// @route   PUT /api/orders/:id/toggle-debt
// @access  Private/Admin
const toggleDebtAssignment = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const user = order.user;
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Toggle the isDebtAssigned field
    order.isDebtAssigned = !order.isDebtAssigned;

    // Update the user's outstanding balance
    if (order.isDebtAssigned) {
        user.outstandingBalance += order.totalPrice;
    } else {
        user.outstandingBalance -= order.totalPrice;
    }

    // Save changes
    await user.save();
    await order.save();

    res.json({
        message: `Order ${order.isDebtAssigned ? "assigned as debt" : "removed from debt"}`,
        isDebtAssigned: order.isDebtAssigned,
    });
});

// @desc    Update order item prices, delivery charge, and extra fee (Admin only)
// @route   PUT /api/orders/:id/update-prices
// @access  Private/Admin
const updateOrderPrices = asyncHandler(async (req, res) => {
    const { updatedItems, deliveryCharge, extraFee } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    updatedItems.forEach((updatedItem) => {
        const item = order.orderItems.find((i) => i.product.toString() === updatedItem.product);
        if (item) {
            item.price = updatedItem.price;
        }
    });

    order.deliveryCharge = deliveryCharge || 0;
    order.extraFee = extraFee || 0;
    order.totalPrice = order.orderItems.reduce(
        (sum, item) => sum + item.price * item.qty, 
        0
    ) + order.deliveryCharge + order.extraFee;

    order.isQuoted = true;
    if (order.status === "Pending") {
        order.status = "Quoted";
    }

    await order.save();

    res.json({ message: "Order prices updated successfully!" });
});

// @desc    Update the seller note on an order
// @route   PUT /api/orders/:id/seller-note
// @access  Private/Admin
const updateSellerNote = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update seller notes");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const { sellerNote } = req.body;
    order.sellerNote = sellerNote || ""; // Update the seller note
    const updatedOrder = await order.save();

    res.json({
        message: "Seller note updated successfully",
        order: updatedOrder
    });
});

// @desc    Update the admin note on an order
// @route   PUT /api/orders/:id/admin-note
// @access  Private/Admin
const updateAdminNote = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update admin notes");
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const { adminNote } = req.body;

    order.adminNote = adminNote || ""; // Update the admin note
    const updatedOrder = await order.save();

    res.json({
        message: "Admin note updated successfully",
        order: updatedOrder
    });
});

// @desc    Toggle order amount assignment to user's outstanding balance
// @route   PUT /api/orders/:id/toggle-debt
// @access  Private/Admin
const toggleOrderDebt = asyncHandler(async (req, res) => {
    const { id: orderId } = req.params;

    // ✅ Find the order
    const order = await Order.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // ✅ Find the associated user
    const user = await User.findById(order.user);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // ✅ Toggle whether the order amount is assigned to the user's outstanding balance
    if (order.isAttachedToDebt) {
        // If already attached, detach it (subtract from outstandingBalance)
        user.outstandingBalance -= order.totalPrice;
        order.isAttachedToDebt = false;
    } else {
        // If not attached, attach it (add to outstandingBalance)
        user.outstandingBalance += order.totalPrice;
        order.isAttachedToDebt = true;
    }

    await order.save();
    await user.save();

    res.json({
        message: `Order ${order.isAttachedToDebt ? "attached to" : "detached from"} user's debt.`,
        order,
        user
    });
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Logged-in users only)
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, note } = req.body;
  
    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
  
    let totalPrice = 0;
  
    const updatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
  
        if (!product) {
          res.status(404);
          throw new Error(`Product not found: ${item.product}`);
        }
  
        const itemTotal = item.price * item.qty;
        totalPrice += itemTotal;
  
        return {
          product: product._id,
          qty: item.qty,
          price: item.price,
        };
      })
    );
  
    const order = new Order({
      user: req.user._id,
      orderItems: updatedOrderItems,
      shippingAddress: req.user.address,
      totalPrice,
      note,
    });
  
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  });
  

// @desc    Get order by ID (Owner/Admin)
// @route   GET /api/orders/:id
// @access  Private (Only the order owner or an admin)
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email phoneNumber") // ✅ Keep it simple
        .populate("orderItems.product", "name images"); // ✅ Get full `images` array

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // ✅ Only the order owner OR an admin can access the order
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(order); // ✅ Send the response as is
    } else {
        res.status(403);
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

// @desc    Toggle order payment status and update User wallet and outstandingBalance (Admin only)
// @route   PUT /api/orders/:id/toggle-pay
// @access  Private/Admin
const toggleOrderPaymentStatus = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update payment status");
    }

    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    const user = order.user;

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const orderTotal = order.totalPrice; // Ensure this is a number
    let message = "";

    if (!order.isPaid) {
        // ✅ Check if the wallet covers the total price
        if (user.wallet < orderTotal) {
            res.status(400);
            throw new Error("Insufficient wallet balance to mark order as paid");
        }

        // Deduct order total from wallet
        user.wallet -= orderTotal;

        // Reduce outstanding balance if applicable
        if (user.outstandingBalance > 0) {
            const amountAppliedToDebt = Math.min(orderTotal, user.outstandingBalance);
            user.outstandingBalance -= amountAppliedToDebt;
        }

        order.isPaid = true;
        order.paidAt = Date.now();

        message = `Paid (Wallet and Debt Decreased)`;
    } else {
        // ✅ Marking as unpaid (Refund to wallet and restore outstanding balance)
        user.wallet += orderTotal;
        user.outstandingBalance += orderTotal;

        order.isPaid = false;
        order.paidAt = null;

        message = `Not Paid (Wallet and Debt Increased)`;
    }

    // ✅ Save changes
    await user.save();
    const updatedOrder = await order.save();

    res.status(200).json({
        message,
        updatedOrder,
        walletBalance: user.wallet,
        outstandingBalance: user.outstandingBalance,
    });
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
    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Not authorized to update stock");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    if (order.stockUpdated) {
        res.status(400);
        throw new Error("Stock has already been deducted for this order");
    }

    try {
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.name}`);
            }

            if (product.stock < item.qty) {
                throw new Error(`Not enough stock for ${product.name}.`);
            }

            product.stock -= item.qty;
            await product.save();
        }

        order.stockUpdated = true;
        await order.save();

        res.json({ message: "Stock deducted successfully", order });
    } catch (error) {
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
    restoreStock, // ✅ New
    toggleOrderDebt,
    updateAdminNote,
    updateSellerNote,
    updateOrderPrices,
    toggleDebtAssignment
};
