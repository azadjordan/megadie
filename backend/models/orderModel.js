import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
            name: { type: String, required: true },
            image: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            specifications: { type: Map, of: String, default: {} },
        }
    ],
    shippingAddress: { type: String, required: true, default: "No Address Provided" },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    note: { type: String, default: "" }, // ✅ Store optional note
    stockUpdated: { type: Boolean, required: true, default: false }, // ✅ New field to track stock updates
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
