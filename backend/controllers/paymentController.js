import asyncHandler from "../middleware/asyncHandler.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";

// @desc    Update payment details (Admin only)
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = asyncHandler(async (req, res) => {
    const { status } = req.body;

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

    // ✅ If status is changing, update user's wallet
    if (status && status !== payment.status) {
        if (status === "Cancelled" && payment.status === "Received") {
            // ✅ Payment is being cancelled → Deduct from user's wallet
            user.wallet -= payment.amount;
        } else if (status === "Received" && payment.status === "Cancelled") {
            // ✅ Payment is being restored → Add back to user's wallet
            user.wallet += payment.amount;
        }
    }

    // ✅ Prevent wallet from going negative
    if (user.wallet < 0) {
        res.status(400);
        throw new Error("Insufficient funds in wallet to cancel this payment.");
    }

    // ✅ Save user and payment updates
    payment.status = status;
    await user.save();
    const updatedPayment = await payment.save();

    res.json(updatedPayment);
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

    // ✅ Validate amount
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("Invalid payment amount");
    }

    // ✅ Create a new payment record
    const payment = new Payment({
        user: userId,
        amount,
        paymentMethod,
        note,
    });

    // ✅ Save to DB
    await payment.save();

    res.status(201).json({
        message: "Payment created successfully!",
        payment,
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


export { createPayment, getAllPayments, getUserPayments, updatePayment };
