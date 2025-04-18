// ✅ invoiceController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Invoice from "../models/invoiceModel.js";
import Order from "../models/orderModel.js";
import PDFDocument from "pdfkit";

// @desc Generate a clean and balanced PDF invoice layout
// @route GET /api/invoices/:id/pdf
// @access Private/Admin
export const getInvoicePDF = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
      .populate("user", "name email")
      .populate("order");
  
    if (!invoice) throw new Error("Invoice not found");
  
    const order = await Order.findById(invoice.order._id)
      .populate("orderItems.product", "name code size");
  
    if (!order) throw new Error("Order not found");
  
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
  
    const leftX = 50;
    const rightX = 320;
    const sectionWidth = 450;
    const gray = "#F4F4F4";
  
    // === Header: Logo + Title
    doc
      .fontSize(26)
      .fillColor("#6B21A8")
      .font("Helvetica-Bold")
      .text("Megadie", leftX, 50)
      .fillColor("black");
  
    doc
      .fontSize(14)
      .text("INVOICE", leftX, 90)
      .moveDown(1.5);
  
    // === Invoice Info Block
    const infoBoxY = doc.y;
    doc
      .rect(leftX, infoBoxY - 10, sectionWidth, 90)
      .fill(gray)
      .fillColor("black");
  
    const infoY = infoBoxY;
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Invoice #:", leftX + 10, infoY + 5)
      .text("Invoice Date:", leftX + 10, infoY + 20)
      .text("Due Date:", leftX + 10, infoY + 35)
      .text("Status:", leftX + 10, infoY + 50);
  
    doc
      .font("Helvetica")
      .text(invoice.invoiceNumber, leftX + 110, infoY + 5)
      .text(new Date(invoice.createdAt).toLocaleDateString(), leftX + 110, infoY + 20)
      .text(invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-", leftX + 110, infoY + 35)
      .text(invoice.status, leftX + 110, infoY + 50);
  
    doc
      .font("Helvetica-Bold")
      .text("Billed To:", rightX + 10, infoY + 5)
      .font("Helvetica")
      .text(invoice.user.name, rightX + 10, infoY + 20)
      .text(invoice.user.email, rightX + 10, infoY + 35);
  
    doc.moveDown(6);
  
    // === Order Summary
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Order Summary", leftX)
      .moveDown(0.5);
  
    const tableTop = doc.y;
    const itemX = leftX;
    const qtyX = leftX + 350;
  
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Item", itemX, tableTop)
      .text("Qty", qtyX, tableTop);
  
    doc.moveTo(itemX, tableTop + 15).lineTo(itemX + sectionWidth, tableTop + 15).stroke();
  
    // === Item Rows (Zebra striping)
    let rowY = tableTop + 25;
    doc.font("Helvetica").fontSize(10);
  
    order.orderItems.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.rect(itemX, rowY - 3, sectionWidth, 20).fill(gray).fillColor("black");
      }
      doc.text(item.product?.name || "N/A", itemX + 5, rowY).text(item.qty.toString(), qtyX, rowY);
      rowY += 20;
    });
  
    // === Totals Block
    rowY += 20;
    doc
      .rect(itemX, rowY, sectionWidth, 60)
      .fill(gray)
      .fillColor("black");
  
    const totalsY = rowY + 10;
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Order Total:", itemX + 20, totalsY)
      .text("Amount Due:", itemX + 20, totalsY + 15)
      .text("Amount Paid:", itemX + 20, totalsY + 30);
  
    doc
      .font("Helvetica")
      .text(`AED ${invoice.originalOrderTotal.toFixed(2)}`, qtyX, totalsY)
      .text(`AED ${invoice.amountDue.toFixed(2)}`, qtyX, totalsY + 15)
      .text(`AED ${invoice.amountPaid.toFixed(2)}`, qtyX, totalsY + 30);
  
    // === Footer (Flat at the bottom, full width, no thank-you message)
    doc
      .fontSize(10)
      .fillColor("#444")
      .font("Helvetica")
      .text("\n\n\n", { align: "center" }); // push content down slightly
  
    const pageHeight = doc.page.height;
    const footerTextY = pageHeight - 80;
  
    doc
      .fontSize(10)
      .fillColor("#444")
      .text("Megadie Trading LLC · Abu Dhabi, UAE", leftX, footerTextY, {
        width: doc.page.width - 2 * leftX,
        align: "center"
      })
      .text("TRN: 123456789 · Email: hello@megadie.com · +971 50 123 4567", {
        width: doc.page.width - 2 * leftX,
        align: "center"
      });
  
    doc.end();
  });
  
// @desc    Get all invoices (Admin only)
// @route   GET /api/invoices
// @access  Private/Admin
export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({})
    .populate("user", "name email")
    .populate("order", "orderNumber totalPrice")
    .sort({ createdAt: -1 });

  res.json(invoices);
});

// @desc    Get invoice by ID (Admin or Owner)
// @route   GET /api/invoices/:id
// @access  Private/Admin or Owner
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user", "name email")
    .populate("order", "orderNumber totalPrice");

  if (invoice) {
    if (req.user.isAdmin || req.user._id.equals(invoice.user._id)) {
      res.json(invoice);
    } else {
      res.status(403);
      throw new Error("Not authorized to view this invoice.");
    }
  } else {
    res.status(404);
    throw new Error("Invoice not found.");
  }
});

// @desc    Create invoice manually (Admin only)
// @route   POST /api/invoices
// @access  Private/Admin
export const createInvoice = asyncHandler(async (req, res) => {
    const { order, user, amountDue, dueDate, adminNote } = req.body;
  
    if (!order || !user || !amountDue) {
      res.status(400);
      throw new Error("Order, user, and amountDue are required.");
    }
  
    const existingInvoice = await Invoice.findOne({ order });
    if (existingInvoice) {
      res.status(400);
      throw new Error("Invoice already exists for this order.");
    }
  
    const Order = (await import("../models/orderModel.js")).default;
    const orderDoc = await Order.findById(order);
  
    if (!orderDoc) {
      res.status(404);
      throw new Error("Order not found.");
    }
  
    const invoice = await Invoice.create({
      order,
      user,
      amountDue,
      originalOrderTotal: orderDoc.totalPrice, // ✅ store snapshot of original total
      dueDate,
      adminNote,
    });
  
    await Order.findByIdAndUpdate(order, { invoiceGenerated: true });
  
    res.status(201).json(invoice);
  });  

// @desc    Update invoice (Admin only)
// @route   PUT /api/invoices/:id
// @access  Private/Admin
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found.");
  }

  Object.assign(invoice, req.body);
  const updatedInvoice = await invoice.save();

  res.json(updatedInvoice);
});

// @desc    Delete invoice (Admin only)
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found.");
  }

  await invoice.deleteOne();
  res.status(204).end();
});

// @desc    Get logged-in user's invoices
// @route   GET /api/invoices/my
// @access  Private
export const getMyInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id })
    .populate("order", "orderNumber totalPrice")
    .sort({ createdAt: -1 });

  res.json(invoices);
});
