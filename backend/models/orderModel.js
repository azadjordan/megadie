import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        qtyPrice: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
      default: "No address provided for this order!",
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    deliveryCharge: { type: Number, required: true, default: 0.0 },
    extraFee: { type: Number, required: true, default: 0.0 },
    deliveredBy: { type: String, default: "" },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
    clientToAdminNote: { type: String, default: "" },
    adminToAdminNote: { type: String, default: "" },
    adminToClientNote: { type: String, default: "" },
    stockUpdated: { type: Boolean, required: true, default: false },
    isMoneyAssigned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔄 Auto-generate order number before validation
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    const lastOrder = await mongoose
      .model("Order")
      .findOne({})
      .sort({ createdAt: -1 })
      .lean();

    const lastNumber = lastOrder?.orderNumber?.split("-")[1] || "00000";
    const nextNumber = String(parseInt(lastNumber) + 1).padStart(5, "0");

    this.orderNumber = `ORD-${nextNumber}`;
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
