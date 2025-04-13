import asyncHandler from "../middleware/asyncHandler.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";

// @desc    Delete a payment (Admin only)
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate("user");

    if (!payment) {
        res.status(404);
        throw new Error("Payment not found.");
    }

    // ✅ Prevent deletion if the payment is not cancelled
    if (payment.status !== "Cancelled") {
        res.status(400);
        throw new Error("Payment must be cancelled before deletion.");
    }

    const user = await User.findById(payment.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    await payment.deleteOne(); // ✅ Delete the payment

    res.json({ message: "Payment deleted successfully." });
});


// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private/Admin
const getPaymentById = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate("user");

    if (!payment) {
        res.status(404);
        throw new Error("Payment not found");
    }

    res.json(payment);
});


// @desc    Update payment details (Admin only)
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = asyncHandler(async (req, res) => {
    const { status, paymentMethod, note } = req.body;

    const payment = await Payment.findById(req.params.id).populate("user");

    if (!payment) {
        res.status(404);
        throw new Error("Payment not found");
    }

    const user = await User.findById(payment.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    let walletMessage = null; // ✅ Store message for toast feedback

    // ✅ If status is changing, update user's wallet
    if (status && status !== payment.status) {
        if (status === "Cancelled" && payment.status === "Received") {
            user.wallet -= payment.amount;
            walletMessage = `${user.name}'s wallet decreased by $${payment.amount.toFixed(2)}`;
        } else if (status === "Received" && payment.status === "Cancelled") {
            user.wallet += payment.amount;
            walletMessage = `${user.name}'s wallet increased by $${payment.amount.toFixed(2)}`;
        }
    }

    // ✅ Prevent wallet from going negative
    if (user.wallet < 0) {
        res.status(400);
        throw new Error("Insufficient funds in wallet to cancel this payment.");
    }

    // ✅ Update payment details
    payment.paymentMethod = paymentMethod || payment.paymentMethod;
    payment.status = status || payment.status;
    payment.note = note || payment.note;

    // ✅ Save user and payment updates
    await user.save();
    const updatedPayment = await payment.save();

    res.json({
        message: walletMessage || "Payment updated successfully.",
        updatedPayment,
    });
});

// @desc    Create a new payment (Admin only)
// @route   POST /api/payments
// @access  Private/Admin
const createPayment = asyncHandler(async (req, res) => {
    const { userId, amount, paymentMethod, note } = req.body;

    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // ✅ Validate and convert amount
    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        res.status(400);
        throw new Error("Invalid payment amount");
    }

    // ✅ Create a new payment record
    const payment = new Payment({
        user: userId,
        amount: paymentAmount, // Ensure it's a number
        paymentMethod,
        note,
    });

    // ✅ Save the payment to the database
    await payment.save();

    // ✅ Update user's wallet balance
    user.wallet = (user.wallet || 0) + paymentAmount; // Ensure wallet is treated as a number
    await user.save();

    res.status(201).json({
        message: `Payment added and Wallet Increased for ${user.name.split(" ")[0]}`,
        payment,
        walletBalance: user.wallet,
    });
});

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find().populate("user", "name phone");
    res.json(payments);
});

// @desc    Get payments for a specific user
// @route   GET /api/payments/user/:userId
// @access  Private
const getUserPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({ user: req.params.userId }).sort({ createdAt: -1 });

    // ✅ Instead of throwing an error, return an empty array if no payments exist
    res.json(payments);
});


export { createPayment, getAllPayments, getUserPayments, updatePayment, getPaymentById, deletePayment };
