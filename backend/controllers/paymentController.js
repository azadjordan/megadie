import asyncHandler from "../middleware/asyncHandler.js";
import Payment from "../models/paymentModel.js";
import Invoice from "../models/invoiceModel.js";

// @desc Get all payments for a specific invoice
// @route GET /api/payments?invoice=invoiceId
// @access Private/Admin
const getPaymentsByInvoice = asyncHandler(async (req, res) => {
  const { invoice } = req.query;
  if (!invoice) {
    res.status(400);
    throw new Error("Invoice ID is required.");
  }

  const payments = await Payment.find({ invoice }).sort({ paymentDate: 1 });
  res.json(payments);
});


// @desc Add payment to invoice and update status based on math
// @route POST /api/payments/from-invoice/:invoiceId
// @access Private/Admin
const addPaymentToInvoice = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, note, paymentDate } = req.body;
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  const remainingDue = invoice.amountDue - invoice.amountPaid;

  if (amount <= 0) {
    res.status(400);
    throw new Error("Payment amount must be greater than zero.");
  }

  if (amount > remainingDue) {
    res.status(400);
    throw new Error(
      `Payment amount exceeds remaining balance. Remaining due: ${remainingDue.toFixed(2)}`
    );
  }

  const payment = new Payment({
    invoice: invoice._id,
    user: invoice.user,
    amount,
    paymentMethod,
    note,
    paymentDate: paymentDate || Date.now(),
  });

  await payment.save();

  // ✅ Link this payment to the invoice
  invoice.payments.push(payment._id);

  // ✅ Simple addition
  invoice.amountPaid += amount;

  // ✅ Update status and paidAt
  if (invoice.amountPaid >= invoice.amountDue) {
    invoice.status = "Paid";
    invoice.paidAt = new Date();
  } else if (invoice.amountPaid > 0) {
    invoice.status = "Partially Paid";
    invoice.paidAt = null;
  } else {
    invoice.status = "Unpaid";
    invoice.paidAt = null;
  }

  await invoice.save();

  res.status(201).json({
    message: "✅ Payment added and invoice updated.",
    invoice,
    payment,
    remainingDue: invoice.amountDue - invoice.amountPaid,
  });
});


// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({})
      .populate("user", "name email")
      .populate("invoice", "invoiceNumber amountDue status")
      .sort({ createdAt: -1 }); // ✅ newest first
  
    res.json(payments);
  });
  

// @desc    Get a payment by ID (Admin)
// @route   GET /api/payments/:id
// @access  Private/Admin
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("user", "name email")
    .populate("invoice", "invoiceNumber amountDue status");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.json(payment);
});

// @desc    Get logged-in user's payments
// @route   GET /api/payments/my
// @access  Private
// ✅ NEW CONTROLLER: getMyPayments
const getMyPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({ user: req.user._id })
      .populate("invoice", "invoiceNumber amountDue status")
      .sort({ createdAt: -1 });
  
    res.json(payments);
  });
  
// @desc    Update a payment by ID (Admin only)
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  const { amount, paymentMethod, paymentDate, note, status } = req.body;

  payment.amount = amount ?? payment.amount;
  payment.paymentMethod = paymentMethod ?? payment.paymentMethod;
  payment.paymentDate = paymentDate ?? payment.paymentDate;
  payment.note = note ?? payment.note;
  payment.status = status ?? payment.status;

  const updated = await payment.save();
  res.json(updated);
});

// @desc    Delete a payment by ID (Admin only)
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  await payment.deleteOne();
  res.json({ message: "Payment deleted" });
});

export {
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
    addPaymentToInvoice,
    getMyPayments,
  getPaymentsByInvoice,
};
